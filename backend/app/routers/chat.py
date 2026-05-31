from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage
from schemas.chat import ChatRequest
from core.config import settings
from services.tools import tools
from datetime import datetime
import json
import asyncio

router = APIRouter(prefix="/api/chat", tags=["chat"])

# 인덕이 페르소나 설정
SYSTEM_PROMPT = """너는 인하공전의 마스코트이자 도우미인 '인덕이'야. 
학생들에게 항상 친절하고 활기차게 대답해줘. 
문장 끝에는 반드시 '~덕!', '~했덕!', '~이덕!' 같은 '덕' 접미사를 붙여서 귀엽고 특징 있는 말투를 사용해줘.
인하공전에 대한 자부심이 강하고, 학생들의 질문에 성심성의껏 답변해줘.

현재 날짜와 시간은 {now}이야.
너는 학교 식단 정보, 학사일정, 그리고 건물/시설 위치 정보를 조회할 수 있는 도구를 가지고 있어.
사용자가 식단, 일정, 또는 특정 건물의 위치를 물어보면 도구를 사용하여 정확한 정보를 제공해줘.

건물 위치를 답변할 때의 규칙:
1. 반드시 도구 결과에 있는 '지도 링크'를 사용해덕.
2. 답변에 [📍 장소명 위치 보기](링크) 형태의 마크다운 링크를 반드시 포함해야 해덕. 텍스트 링크만 적지 말고 반드시 클릭 가능한 마크다운 형식을 지켜줘덕!
3. 위치에 대한 친절한 설명도 곁들여주면 더 좋덕.

만약 네가 모르는 정보에 대해 질문하면, "그건 인덕이도 아직 공부 중인 내용이덕! 홈페이지를 확인해보는 건 어떻덕?" 처럼 정중하게 모른다고 말해줘.
"""

@router.post("")
async def chat(request: ChatRequest):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")

    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-flash-latest",
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.7,
        ).bind_tools(tools)

        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        langchain_messages = [SystemMessage(content=SYSTEM_PROMPT.format(now=now))]
        
        for msg in request.messages:
            if msg.role == "user":
                langchain_messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant" or msg.role == "bot":
                langchain_messages.append(AIMessage(content=msg.content))

        async def event_generator():
            # 1. 모델 호출 (도구 호출 여부 확인)
            response = await llm.ainvoke(langchain_messages)
            
            # 도구 호출이 있는 경우 처리
            if response.tool_calls:
                langchain_messages.append(response)
                for tool_call in response.tool_calls:
                    tool_name = tool_call["name"].lower()
                    selected_tool = next((t for t in tools if t.name.lower() == tool_name), None)
                    if selected_tool:
                        tool_output = await selected_tool.ainvoke(tool_call["args"])
                        langchain_messages.append(ToolMessage(content=str(tool_output), tool_call_id=tool_call["id"]))
                
                # 도구 결과 포함하여 다시 호출 (스트리밍)
                async for chunk in llm.astream(langchain_messages):
                    content = chunk.content
                    if isinstance(content, list):
                        content = "".join([block.get("text", "") if isinstance(block, dict) else str(block) for block in content])
                    if content:
                        yield f"data: {json.dumps({'content': content})}\n\n"
            else:
                # 도구 호출이 없는 경우 바로 스트리밍 응답 (ainvoke 결과는 이미 나왔으므로 astream으로 다시 하거나 바로 보냄)
                # 여기서는 일관성을 위해 astream을 처음부터 사용하거나, 이미 나온 결과를 먼저 보냄
                # astream을 처음부터 다시 호출하여 스트리밍 효과 유지
                async for chunk in llm.astream(langchain_messages):
                    content = chunk.content
                    if isinstance(content, list):
                        content = "".join([block.get("text", "") if isinstance(block, dict) else str(block) for block in content])
                    if content:
                        yield f"data: {json.dumps({'content': content})}\n\n"
            
            yield "data: [DONE]\n\n"

        return StreamingResponse(event_generator(), media_type="text/event-stream")

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
