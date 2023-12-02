import { TrailerRCJ } from "@/API";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import { SetStateAction } from "react";

type SearchProps = {
  value: string | string[] | undefined;
  setValue: (value: SetStateAction<string | string[] | undefined>) => void;
  setTrailers: (value: SetStateAction<TrailerRCJ[]>) => void;
  search: string | string[] | undefined;
};

const Search = ({ value, setValue, setTrailers, search }: SearchProps) => {
  const router = useRouter();

  const handleChange = (input: string) => {
    setValue(input);
  };

  const handleSearch = () => {
    router.push(`/?search=${value}`, undefined, { shallow: true });
  };

  const handleClear = () => {
    router.push("/");
    setValue("");
    setTrailers([]);
  };
  return (
    <div className="w-full mx-auto my-auto text-center">
      <div className="flex justify-center items-center w-4/5 gap-2 mx-auto mb-4 xl:w-1/2">
        <Input
          className="text-xl"
          name="query"
          radius="sm"
          size="sm"
          type="search"
          placeholder="Enter chassis number"
          value={value as string}
          onValueChange={handleChange}
        />
        <Button
          size="lg"
          color="primary"
          radius="sm"
          onPress={handleSearch}
          className="text-sm uppercase font-bold">
          Search
        </Button>
      </div>
      {search != null && search?.length > 0 && (
        <Button
          size="md"
          onPress={handleClear}
          radius="sm"
          color="danger"
          className="text-sm uppercase font-bold">
          Clear
        </Button>
      )}
    </div>
  );
};

export default Search;
