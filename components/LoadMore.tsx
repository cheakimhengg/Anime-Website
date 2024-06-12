"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import AnimeCard from "./AnimeCard";
import { fetchAnime } from "@/app/action";

let page = 1;

export type AnimeCard = JSX.Element;

function LoadMore() {
  const { ref, inView } = useInView({});
  const [data, setData] = useState<AnimeCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async (page: number, searchQuery: string) => {
    const res = await fetchAnime(page, searchQuery);
    setData((prevData) => [...prevData, ...res]);
  };

  useEffect(() => {
    if (inView) {
      fetchData(page, searchQuery);
      page++;
    }
  }, [inView, searchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
    setData([]);
    page = 1;
  };

  return (
    <>
      <div className="flex flex-row">
        <h2 className="text-3xl text-white font-bold w-full">Explore Anime</h2>
        <section className="flex justify-end items-center w-full mb-4">
          <input
            type="text"
            placeholder="Search Anime"
            value={searchQuery}
            onChange={handleSearch}
            className="p-2 w-[70%] border border-white rounded"
          />
        </section>
      </div>
      <section className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {data}
      </section>
      <section className="flex justify-center items-center w-full">
        <div ref={ref}>
          <Image
            src="./spinner.svg"
            alt="spinner"
            width={56}
            height={56}
            className="object-contain"
          />
        </div>
      </section>
    </>
  );
}

export default LoadMore;
