import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { Inter } from "next/font/google";

import { TrailerRCJ } from "@/API";
import { generateClient } from "aws-amplify/api";
import { listTrailerRCJS } from "@/graphql/queries";

import { RCJIcon } from "@/components/icons/RCJIcon";
import TableChassis from "@/components/table/Table";
import Search from "@/components/Search";

const inter = Inter({ subsets: ["latin"] });

function Home() {
  const router = useRouter();
  const client = generateClient();
  let { search } = router.query;
  const [trailers, setTrailers] = useState<Array<TrailerRCJ>>([]);

  const getTrailersRCJ = async (input: string) => {
    if (input != null) {
      const allTrailerRCJ: any = await client.graphql({
        query: listTrailerRCJS,
        variables: {
          filter: {
            chassisNumber: {
              eq: input.toUpperCase(),
            },
          },
        },
      });
      const { data } = allTrailerRCJ;

      setTrailers(data.listTrailerRCJS.items);
    }
  };

  useEffect(() => {
    if (router.query && search) {
      getTrailersRCJ(search as string);
    }
  }, [router.query, search]);

  return (
    <div className="fixed w-full h-full bg-gradient-to-r from-cyan-200/50 to-blue-400/80 overflow-scroll ">
      <div className="flex mx-auto mt-5 justify-center ">
        <a
          className=""
          href="https://rcjtransport.com/"
          title="Go to our main website"
          target="_blank"
          rel="noopener">
          <RCJIcon />
        </a>
      </div>
      <div className="flex flex-col bg-[url('../../public/rcj_background.jpg')] bg-opacity-10 w-full mt-4 h-[300px] md:h-[400px] md:mt-8 items-center gap-3 bg-cover bg-center shadow-lg  backdrop-blur-xs">
        <Search setTrailers={setTrailers} />
      </div>
      <TableChassis trailers={trailers} setTrailers={setTrailers} />
    </div>
  );
}

export default Home;
