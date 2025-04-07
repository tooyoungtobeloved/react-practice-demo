import useSet from '../hooks/useSet'
export default function Component() {
    const { set, add, remove, toggle, reset, clear } = useSet(new Set(['hello']));
    function debuggerReset() {
      console.log(set);
      reset();
      console.log(set);
    }
    return (
      <div>
        <button onClick={() => add(Date.now().toString())}>Add</button>
        <button onClick={() => remove('hello')}>
          Remove 'hello'
        </button>
        <button onClick={() => toggle('hello')}>Toggle hello</button>
        <button onClick={() => debuggerReset()}>Reset</button>
        <button onClick={() => clear()}>Clear</button>
        <pre>{JSON.stringify(Array.from(set), null, 2)}</pre>
      </div>
    );
  }