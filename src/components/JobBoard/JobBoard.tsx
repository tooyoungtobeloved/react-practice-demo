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
  const { items: jobs, state, canLoadMore, setPage } = useLoadMore({ fetchIds, fetchItem });
  return (
    <div className="container">
      <div className="header">Hacker News Jobs Board</div>
      {state.status === "loading" && <div className="loading">Loading...</div>}
      {jobs.length > 0 && (
        <>
          {jobs.map((job) => {
            return <Job key={job.id} job={job} />;
          })}
          {canLoadMore && (
            <button
              className="loadmore"
              onClick={() => setPage((prevPage) => prevPage + 1)}
            >
              {state.status === "loading" ? "Loading..." : "Load More"}
            </button>
          )}
        </>
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

async function fetchIds() {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/jobstories.json"
  );
  if (!response.ok) {
    throw new Error("网络响应异常");
  }
  return response.json();
}
async function fetchItem(id: number) {
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );
  if (!response.ok) {
    throw new Error("网络响应异常");
  }
  return response.json();
}
