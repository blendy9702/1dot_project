"use client";

import { useEffect, useMemo, useState } from "react";
import { BlogUsage, generateBlogUsageData } from "../../data/data";
import { Pagination } from "../Pagination";

export function BlogWorkList() {
  // 블로그 사용량 (테이블 + 검색 + 페이지네이션)
  const [blogUsageList] = useState<BlogUsage[]>(() =>
    generateBlogUsageData(53)
  );
  const [blogQuery, setBlogQuery] = useState<string>("");
  const filteredBlogUsage = useMemo(() => {
    return blogUsageList.filter((b) =>
      b.url.toLowerCase().includes(blogQuery.toLowerCase())
    );
  }, [blogUsageList, blogQuery]);
  const [blogPage, setBlogPage] = useState<number>(1);
  const BLOG_PAGE_SIZE = 10;
  useEffect(() => {
    setBlogPage(1);
  }, [blogQuery]);
  const blogTotalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredBlogUsage.length / BLOG_PAGE_SIZE)),
    [filteredBlogUsage.length]
  );
  const blogVisible = useMemo(() => {
    const start = (blogPage - 1) * BLOG_PAGE_SIZE;
    return filteredBlogUsage.slice(start, start + BLOG_PAGE_SIZE);
  }, [filteredBlogUsage, blogPage]);

  return (
    <div>
      {/* 블로그 사용량 */}
      <div className="mb-4 p-3 bg-light border rounded">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="m-2">블로그 사용량</h5>
          <div className="text-muted small">
            총 {filteredBlogUsage.length}건
          </div>
        </div>
        <div className="mb-3 d-flex gap-2 align-items-end">
          <div>
            <label className="form-label mb-1 small">URL</label>
            <input
              className="form-control form-control-sm"
              placeholder="URL 검색"
              value={blogQuery}
              onChange={(e) => setBlogQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="table-responsive" style={{ minHeight: 400 }}>
          <table className="table table-sm table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>블로그 URL</th>
                <th>접속 횟수</th>
              </tr>
            </thead>
            <tbody>
              {blogVisible.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center text-muted py-4">
                    조건에 맞는 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                blogVisible.map((b) => (
                  <tr key={b.url}>
                    <td>
                      <a href={b.url} target="_blank" rel="noreferrer">
                        {b.url}
                      </a>
                    </td>
                    <td>{b.accessCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-2">
          <Pagination
            currentPage={blogPage}
            totalPages={blogTotalPages}
            onPageChange={setBlogPage}
          />
        </div>
      </div>
    </div>
  );
}
