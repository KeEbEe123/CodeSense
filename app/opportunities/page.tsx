import OpportunitiesList from "@/components/OpportunitiesList";
import OpportunityForm from "@/components/OpportunityForm";
import React from "react";

const page = () => {
  return (
    <div>
      <h1 className="text-4xl text-cyan-400 font-koulen justify-center">
        <div className="w-30">
          <OpportunitiesList />
        </div>
      </h1>
    </div>
  );
};

export default page;
