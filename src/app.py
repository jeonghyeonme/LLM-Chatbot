import streamlit as st
import time

# 페이지 설정
st.set_page_config(page_title="엘리아 & 루나: 듀얼 상담소", page_icon="✨")

# 스타일 커스터마이징 (CSS)
st.markdown("""
    <style>
    .stChatMessage { border-radius: 15px; margin-bottom: 10px; }
    .persona-label { font-weight: bold; font-size: 0.8rem; margin-bottom: 5px; }
    .elia-label { color: #1E88E5; }
    .luna-label { color: #EC407A; }
    </style>
    """, unsafe_allow_html=True)

# 세션 상태 초기화
if "messages" not in st.session_state:
    st.session_state.messages = []

# 사이드바 구성
with st.sidebar:
    st.title("⚙️ 설정")
    st.info("이성적인 엘리아와 감성적인 루나의 조언을 동시에 들어보세요.")
    if st.button("대화 기록 초기화"):
        st.session_state.messages = []
        st.rerun()

st.title("✨ 엘리아 & 루나의 상담소")
st.caption("고민을 말씀해 주세요. 두 페르소나가 함께 답해 드립니다.")

# 대화 기록 표시
for message in st.session_state.messages:
    with st.chat_message(message["role"], avatar=message.get("avatar")):
        if "persona" in message:
            label_class = "elia-label" if message["persona"] == "엘리아" else "luna-label"
            st.markdown(f'<div class="persona-label {label_class}">{message["persona"]}</div>', unsafe_allow_html=True)
        st.markdown(message["content"])

# 사용자 입력
if prompt := st.chat_input("어떤 고민이 있으신가요?"):
    # 1. 사용자 메시지 추가
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # 2. 답변 생성 시뮬레이션 (실제 구현 시 LLM 호출 로직으로 교체)
    with st.spinner("엘리아와 루나가 생각 중입니다..."):
        time.sleep(1.5) # 생각하는 척

        # 답변 데이터 예시
        elia_response = f"엘리아: '{prompt}'에 대한 이성적인 분석입니다. 현재 상황을 데이터로 파악하고 단계별 해결책을 고려해야 합니다."
        luna_response = f"루나: '{prompt}' 때문에 마음이 많이 힘드셨죠? 그 마음 제가 다 이해해요. 조금은 쉬어가도 괜찮아요."
        interaction = "루나: 엘리아, 가끔은 분석보다 위로가 더 힘이 될 때가 있어요.\n엘리아: 동의합니다. 하지만 실질적인 변화가 동반되어야 감정도 안정될 수 있죠."

    # 3. 답변 출력 (병렬 구조)
    col1, col2 = st.columns(2)
    
    with col1:
        with st.chat_message("assistant", avatar="🤖"):
            st.markdown('<div class="persona-label elia-label">엘리아</div>', unsafe_allow_html=True)
            st.write(elia_response)
            st.session_state.messages.append({
                "role": "assistant", 
                "persona": "엘리아", 
                "content": elia_response,
                "avatar": "🤖"
            })

    with col2:
        with st.chat_message("assistant", avatar="🌸"):
            st.markdown('<div class="persona-label luna-label">루나</div>', unsafe_allow_html=True)
            st.write(luna_response)
            st.session_state.messages.append({
                "role": "assistant", 
                "persona": "루나", 
                "content": luna_response,
                "avatar": "🌸"
            })

    # 4. 페르소나 간 상호작용 표시
    with st.expander("💬 엘리아와 루나의 대화 엿보기"):
        st.write(interaction)
        st.session_state.messages.append({
            "role": "system", 
            "content": f"**[페르소나 간 대화]**\n{interaction}"
        })
