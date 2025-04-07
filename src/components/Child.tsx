import { type PropsWithChildren } from "react"
interface IProps {
    name: string;
}

export default function Child(props: PropsWithChildren<IProps>) {
  return (
    <div className="w-100 font-bold underline">
      <h1>{ props.name }</h1>
      <span>{props.children }</span>
    </div>
  );
}

