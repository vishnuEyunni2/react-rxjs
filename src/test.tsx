import "reflect-metadata";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
// import App from './App'
import {
  delay,
  filter,
  from,
  map,
  mergeMap,
  Observable,
  BehaviorSubject,
} from "rxjs";

const getPokemonName = async (name: string) => {
  const { resutls: allPokemons } = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=1000"
  ).then((res) => res.json());
  return allPokemons.filter((pokemon: any) => pokemon.name.includes(name));
};

let searchSubject = new BehaviorSubject("");

function FApp() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Array<string>>([]);

  useObservable<string>(searchSubject, setResults )

  const onChangeHandler = (e) => {
    const val = e.target.value;
    setSearch(val);
    searchSubject.next(val);
  };

  return (
    <div
      id="FApp"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <label htmlFor="Search">Search term:</label>
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Enter search term"
        value={search}
        onChange={onChangeHandler}
      />
    </div>
  );
}

let numObs = from([1, 2, 3, 4, 5]);
let subs = numObs.pipe(
  filter((x) => x > 2),
  mergeMap((val) => from([val]).pipe(delay(1000 * val))),
  map((x) => x * x)
);

export function useObservable<T>(
  observable: Observable<T>,
  setter: React.Dispatch<React.SetStateAction<T>>
){
  useEffect(() => {
    let subscription = observable.subscribe((res) => {
      setter(res);
    });
    return () => subscription.unsubscribe();
  }, [observable, setter]);
};

function RxApp() {
  const [currNum, setCurrNum] = useState(0);
  useObservable(subs, setCurrNum);
  return (
    <>
      <div id="rx-app">
        <p>Curr number is: {currNum}</p>
      </div>
    </>
  );
}

function App() {
  const [search, setSearch] = useState("");

  const onChangeHandler = (e: any) => {
    const newVal = e.target.value;
    setSearch(newVal);
  };

  return (
    <>
      <div id="app">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={onChangeHandler}
        />
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <App />
        <RxApp /> */}
    <FApp />
  </React.StrictMode>
);
