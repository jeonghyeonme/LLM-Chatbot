import warnings
import google.generativeai as genai
from core.config import settings

# 구글 라이브러리 지원 종료 경고 무시 (발표 시 터미널 가독성 확보)
warnings.filterwarnings("ignore", category=FutureWarning, module="google.generativeai")

class EmbeddingService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # 실제 지원 모델 명칭으로 수정
        self.model = 'models/gemini-embedding-001' 

    def get_embedding(self, text: str):
        """
        텍스트를 벡터(리스트 형태)로 변환합니다.
        """
        if not text:
            return None
        
        try:
            # 텍스트가 너무 길면 모델 제한에 걸릴 수 있으므로 3000자 내외로 절삭
            truncated_text = text[:3072]
            result = genai.embed_content(
                model=self.model,
                content=truncated_text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return None

    def get_query_embedding(self, query: str):
        """
        검색 질의용 벡터를 생성합니다.
        """
        try:
            result = genai.embed_content(
                model=self.model,
                content=query,
                task_type="retrieval_query"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating query embedding: {e}")
            return None

embedding_service = EmbeddingService()
