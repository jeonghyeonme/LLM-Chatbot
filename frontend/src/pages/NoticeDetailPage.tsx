import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeft, Calendar, Eye, User, Share2, Download, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase'; 

interface NoticeDetail {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  views: number;
  content: string;
  attachments: { name: string; size: string }[];
}

const NoticeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();


  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!id) return;

    const fetchNoticeDetail = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          const detailData: NoticeDetail = {
            id: String(data.id),
            category: data.category || '일반',
            title: data.title || '제목 없음',
            author: data.author || '관리자',
            date: data.date || '2026-06-05',
            views: (data.views || 0) + 1,
            content: data.content || '본문 내용이 존재하지 않습니다.',
            attachments: Array.isArray(data.attachments) && data.attachments.length > 0 
              ? data.attachments.map((file: any) => ({
                  name: file.name || '첨부파일',
                  size: file.size || '알 수 없음'
                }))
              : []
          };
          setNotice(detailData);

          await supabase
            .from('notices')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);
        }
      } catch (err) {
        console.error('상세 본문 로드 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-inha-bg flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-inha-blue animate-spin" />
          <p className="text-sm text-gray-500">본문 내용을 안전하게 가져오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-inha-bg flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500">존재하지 않는 공지사항 게시글입니다.</p>
          <button onClick={() => navigate('/notices')} className="px-4 py-2 bg-inha-blue text-white rounded-xl text-sm">목록으로</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-inha-bg flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <button 
            onClick={() => navigate('/notices')}
            className="flex items-center gap-2 text-inha-text-sub hover:text-inha-blue transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            목록으로 돌아가기
          </button>

          <article className="bg-white rounded-inha-card border border-inha-border shadow-inha-card overflow-hidden">
            {/* 상단 제목 영역 */}
            <div className="p-6 md:p-8 border-b border-inha-border">
              <span className="inline-block px-3 py-1 bg-inha-blue/10 text-inha-blue text-xs font-bold rounded-full mb-4">
                {notice.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {notice.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{notice.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{notice.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>조회수 {notice.views}</span>
                </div>
              </div>
            </div>

            {/* 본문 영역 */}
            <div className="p-6 md:p-8 text-gray-700 leading-relaxed whitespace-pre-line min-h-[300px]">
              {notice.content}
            </div>

            {/* 첨부파일 영역 */}
            <div className="p-6 md:p-8 bg-gray-50 border-t border-inha-border">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Download className="w-4 h-4 text-inha-blue" />
                첨부파일 ({notice.attachments.length})
              </h3>
              <div className="flex flex-col gap-2">
                {notice.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white border border-inha-border rounded-xl hover:border-inha-blue/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-inha-blue/5 group-hover:text-inha-blue transition-colors">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-inha-blue transition-colors">{file.name}</p>
                        <p className="text-xs text-gray-400">{file.size}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-inha-blue">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </article>
          
          {/* 이전/다음글 이동 (더미) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex flex-col p-4 bg-white border border-inha-border rounded-2xl hover:border-inha-blue/30 transition-all text-left">
              <span className="text-xs text-gray-400 mb-1">이전글</span>
              <span className="text-sm font-medium text-gray-900 truncate">2026학년도 하반기 교내 장학금 신청 안내</span>
            </button>
            <button className="flex flex-col p-4 bg-white border border-inha-border rounded-2xl hover:border-inha-blue/30 transition-all text-left">
              <span className="text-xs text-gray-400 mb-1 text-right">다음글</span>
              <span className="text-sm font-medium text-gray-900 truncate text-right">학생회관 식당 운영 시간 변경 안내</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoticeDetailPage;