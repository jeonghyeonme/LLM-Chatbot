import streamlit as st
import time

# 페이지 설정
st.set_page_config(page_title="엘리아 & 루나: 듀얼 상담소", page_icon="💬", layout="centered")

# 다크 모드 및 레드 포인트 UI 스타일 적용
st.markdown("""
    <style>
    /* 전체 배경색 - Streamlit 다크 모드 배경색 */
    .stApp {
        background-color: #0E1117;
        color: #FAFAFA;
    }
    
    /* 채팅 컨테이너 */
    .main .block-container {
        padding-top: 2rem;
        max-width: 700px;
    }

    /* 공통 말풍선 스타일 */
    .chat-bubble {
        padding: 10px 14px;
        border-radius: 18px;
        margin-bottom: 10px;
        max-width: 85%;
        font-size: 15px;
        line-height: 1.5;
        position: relative;
        display: inline-block;
    }

    /* 사용자 말풍선 (우측, 테마 포인트 레드) */
    .user-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }
    .user-bubble {
        background-color: #FF4B4B;
        color: #FFFFFF;
        border-bottom-right-radius: 2px;
        box-shadow: 0 2px 8px rgba(255, 75, 75, 0.3);
    }

    /* 페르소나 말풍선 (좌측, 다크 그레이) */
    .persona-container {
        display: flex;
        flex-direction: row;
        margin-bottom: 15px;
    }
    .persona-avatar {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        background-color: #262730;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin-right: 10px;
        flex-shrink: 0;
        border: 1px solid #444;
    }
    .persona-content {
        display: flex;
        flex-direction: column;
    }
    .persona-name {
        font-size: 13px;
        font-weight: 600;
        color: #B0B0B0;
        margin-bottom: 4px;
    }
    .persona-bubble {
        background-color: #262730;
        color: #FAFAFA;
        border-bottom-left-radius: 2px;
        border: 1px solid #3E3F4B;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    /* 시스템 메시지 */
    .system-container {
        display: center;
        justify-content: center;
        text-align: center;
        margin: 25px 0;
    }
    .system-bubble {
        background-color: rgba(255, 255, 255, 0.05);
        color: #888;
        font-size: 12px;
        padding: 5px 15px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* 스트림릿 기본 요소 숨기기 */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .stChatMessage {display: none;}
    </style>
    """, unsafe_allow_html=True)

# 메시지 출력 함수
def display_message(role, content, persona=None, avatar=None):
    if role == "user":
        st.markdown(f"""
            <div class="user-container">
                <div class="chat-bubble user-bubble">{content}</div>
            </div>
            """, unsafe_allow_html=True)
    elif role == "assistant":
        st.markdown(f"""
            <div class="persona-container">
                <div class="persona-avatar">{avatar}</div>
                <div class="persona-content">
                    <div class="persona-name">{persona}</div>
                    <div class="chat-bubble persona-bubble">{content}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)
    elif role == "system":
        st.markdown(f"""
            <div class="system-container">
                <div class="system-bubble">{content}</div>
            </div>
            """, unsafe_allow_html=True)

# 세션 상태 초기화
if "messages" not in st.session_state:
    st.session_state.messages = []

# 앱 제목 (다크 모드에 맞는 화이트 버블 스타일)
st.markdown("""
    <div style='display: flex; justify-content: center; margin-bottom: 30px;'>
        <div style='
            background-color: rgba(255, 255, 255, 0.1); 
            color: #FFFFFF; 
            padding: 12px 28px; 
            border-radius: 25px; 
            border: 1px solid rgba(255, 255, 255, 0.2); 
            font-size: 1.4rem; 
            font-weight: 700;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        '>
            ✨ 엘리아 & 루나 듀얼 상담소
        </div>
    </div>
    """, unsafe_allow_html=True)

# 대화 기록 표시
for msg in st.session_state.messages:
    display_message(msg["role"], msg["content"], msg.get("persona"), msg.get("avatar"))

# 사용자 입력
if prompt := st.chat_input("고민을 입력해 주세요..."):
    # 1. 사용자 메시지 추가 및 표시
    st.session_state.messages.append({"role": "user", "content": prompt})
    display_message("user", prompt)

    # 2. 답변 생성 시뮬레이션
    with st.spinner("두 분이 대화 중입니다..."):
        time.sleep(1.5)

        # 예시 데이터 (실제 연동 시 이 부분을 LLM 결과로 대체)
        responses = [
            {
                "role": "assistant",
                "persona": "엘리아",
                "avatar": "🤖",
                "content": f"'{prompt}'에 대해 이성적으로 분석해 보았습니다. 우선 가장 큰 원인이 무엇인지 객관적으로 파악하는 단계가 필요해 보입니다."
            },
            {
                "role": "assistant",
                "persona": "루나",
                "avatar": "🌸",
                "content": f"엘리아 말도 맞지만, 지금은 그 마음을 먼저 다독여주는 게 중요할 것 같아요. {prompt} 때문에 얼마나 속상하셨을지 제가 다 느껴지네요."
            },
            {
                "role": "system",
                "content": "엘리아와 루나가 의견을 나누기 시작합니다"
            },
            {
                "role": "assistant",
                "persona": "루나",
                "avatar": "🌸",
                "content": "엘리아, 사용자님께는 지금 당장의 해결책보다 따뜻한 응원이 더 큰 힘이 될 거예요."
            },
            {
                "role": "assistant",
                "persona": "엘리아",
                "avatar": "🤖",
                "content": "루나의 의견에 동의합니다. 정서적 지지가 충분히 이루어진 뒤에 현실적인 대안을 함께 모색해 보는 것이 좋겠군요."
            }
        ]

        # 3. 답변을 순차적으로 표시 및 저장
        for res in responses:
            time.sleep(0.8) # 실제 카톡처럼 시간차를 두고 등장
            display_message(res["role"], res["content"], res.get("persona"), res.get("avatar"))
            st.session_state.messages.append(res)
        
    st.rerun()

# 사이드바 (기능 유지)
with st.sidebar:
    st.title("⚙️ 설정")
    if st.button("대화 기록 초기화"):
        st.session_state.messages = []
        st.rerun()
