"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import AnimeCard, { AnimeProp } from "./AnimeCard";
import { fetchAnime } from "@/app/action";

let page = 1;

export type AnimeCard = JSX.Element;

function LoadMore() {
  const { ref, inView } = useInView({});
  const [data, setData] = useState<AnimeCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async (page: number, searchQuery: string) => {
    const res = await fetchAnime(page, searchQuery);
    setData((prevData) => [...prevData, ...res]);
  };

  useEffect(() => {
    if (inView) {
      fetchData(page, searchQuery);
      page++;
    }
  }, [inView]);

  useEffect(() => {
    page = 1;
    setData([]);
    fetchData(page, searchQuery);
    page++;
  }, [searchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(query);
    }, 500);
  };

  return (
    <>
      <div className="flex flex-row">
        <h2 className="text-3xl text-white font-bold w-full">Explore Anime</h2>
        <section className="flex justify-end items-center w-full mb-4">
          <input
            type="text"
            placeholder="Search Anime"
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
            src="/spinner.svg"
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
