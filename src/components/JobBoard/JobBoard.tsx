import useLoadMore from "../../hooks/useLoadMore";
import "./style.css";

interface Job {
  by: string;
  id: number;
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

export default function JobBoard() {
  // 注意：需要从 useLoadMore 中获取 hasFetchedPage
  const { items: jobs, state, canLoadMore, setPage, hasFetchedPage } = useLoadMore({
    fetchIds,
    fetchItem,
    pageSize: 6,
  });

  return (
    <div className="container">
      <div className="header">Hacker News Jobs Board</div>

      {/* 加载状态 */}
      {state.status === "loading" && <div className="loading">Loading...</div>}

      {/* 错误状态 */}
      {state.status === "error" && (
        <div className="error">Error: {state.error?.message}</div>
      )}

      {/* 数据渲染 */}
      {jobs.length > 0 && (
        <>
          {jobs.map((job) => (
            <Job key={job.id} job={job} />
          ))}

          {/* 加载更多按钮 */}
          {canLoadMore && (
            <button
              className="loadmore"
              onClick={() => setPage((prevPage) => prevPage + 1)}
              disabled={state.status === "loading"}
            >
              {state.status === "loading" ? "Loading..." : "Load More"}
            </button>
          )}
        </>
      )}

      {/* 空数据提示：仅在已加载过 job 数据后 jobs 仍为空才显示 */}
      {jobs.length === 0 && hasFetchedPage && state.status === "success" && (
        <div className="empty">No jobs available.</div>
      )}
    </div>
  );
}

function Job({ job }: { job: Job }) {
  const { by, time, url, title } = job;
  return (
    <div className="job">
      <div className="title">
        <h2>
          <a href={url} target="_blank" rel="noreferrer">
            {title}
          </a>
        </h2>
      </div>
      <div className="meta">
        <span className="by">
          By {by}
          {"·"}
        </span>
        <span className="time">
          {new Date(time * 1000).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

// 获取所有 job IDs
async function fetchIds(): Promise<number[]> {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/jobstories.json"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch job IDs");
  }
  return response.json();
}

// 根据 ID 获取 job 详情
async function fetchItem(id: number): Promise<any> {
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch job with ID: ${id}`);
  }
  return response.json();
}