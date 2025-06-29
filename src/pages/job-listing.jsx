import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { use, useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useState } from "react";
import { State } from "country-state-city";
import JobCard from "@/components/job-card";
import { Input } from "@/components/ui/input";
import { getCompanies } from "@/api/apiCompanies";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JobListing = () => {
   const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
   loading: loadingJobs,
    data: jobs,
  }=useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  const {
  data: companies,
  fn: fnCompanies,
  error: companiesError,
} = useFetch(getCompanies);

if (companiesError) {
  console.error("Companies fetch error:", companiesError);
}
  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded)  fnJobs();
  }, [isLoaded , location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) {
      setSearchQuery(query);
    }
  }

  const clearFilters = () => {
    setLocation("");
    setCompany_id("");
    setSearchQuery("");
  };

    if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (  <div className="">
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      <form onSubmit={handleSearch} className="h-14 flex w-full gap-2 items-center mb-3">
        <Input
        type="text"
        placeholder="Search Jobs by Title.."
        name="search-query"
        className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search  
        </Button>
      </form>

    <div className="flex flex-col gap-2 sm:flex-row w-full">
  <Select
    value={location}
    onValueChange={setLocation}
    className="w-full sm:w-2/5"
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Filter by Location" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {State.getStatesOfCountry("IN").map(({ name }) => (
          <SelectItem key={name} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>

  <Select
    value={company_id}
    onValueChange={setCompany_id}
    className="w-full sm:w-2/5"
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Filter by Company" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {companies?.map(({ name, id }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>

  <Button
    className="w-full sm:w-1/5 min-w-[120px]"
    variant="destructive"
    onClick={clearFilters}
  >
    Clear Filters
  </Button>
</div>

      { loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length?(
            jobs.map((job) => {
              return <JobCard key={job.id} job={job}
              savedInit={job.saved?.length > 0}
              />;
            })
          ) : (
            <div>No Jobs Found ..!</div>
          )}
        </div>
      )}
      </div>
      );
};

export default JobListing;