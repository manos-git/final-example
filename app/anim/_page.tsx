
import { fetchAnime } from "./action";

//import LoadMore from "../components/LoadMore";
//import AnimeCard, { AnimeProp } from "@/components/AnimeCard";

interface AnimeProp {
  id: string;
  name: string;
  image: {
    original: string;
  };
  kind: string;
  episodes: number;
  episodes_aired: number;
  score: string;
}

interface Prop {
  anime: AnimeProp;
  index: number;
}


async function Home() {
  const data = await fetchAnime(1);
  
  
    
  return (
    <main>
    <h2 >dgdfg</h2>
      {data.forEach((item: Prop["anime"], key: Prop["index"]) => {
              //console.log(key, item.episodes);
              <li key={'key'}> {'item.episodes'} </li>
              })
      }

    </main>
  
    
  );
}

export default Home;
