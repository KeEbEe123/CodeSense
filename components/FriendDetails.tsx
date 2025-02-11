import { useEffect, useState } from "react";
import axios from "axios";
import { Image, Skeleton } from "@heroui/react";

interface FriendDetailsProps {
  email: string;
}

const FriendDetails: React.FC<FriendDetailsProps> = ({ email }) => {
  const [friendDetails, setFriendDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFriendDetails = async () => {
      try {
        const response = await axios.get(`/api/getUserByEmail?email=${email}`);
        setFriendDetails(response.data.user);
      } catch (err) {
        setError("Failed to fetch friend details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendDetails();
  }, [email]);

  if (loading) {
    return (
      <div className="max-w-[300px] w-full flex items-center gap-3">
        <div className="w-full flex flex-col gap-2">
          <Skeleton animated className="bg-background h-3 w-3/5 rounded-lg" />
          <Skeleton animated className="bg-background h-3 w-4/5 rounded-lg" />
        </div>
        <div>
          <Skeleton className="bg-background flex rounded-full w-12 h-12" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!friendDetails) {
    return <p>No details available</p>;
  }

  return (
    <Skeleton
      isLoaded={!loading}
      animated
      className="bg-background w-full rounded-xl"
    >
      <div>
        <div className="flex items-center justify-between space-x-4">
          <h3 className="text-lg font-semibold font-pop text-offwhite">
            {friendDetails.name}
          </h3>
          <Image
            src={friendDetails.image || "/default-profile.png"}
            alt="Profile Picture"
            className="rounded-full ring-4 ring-primary w-10"
          />
        </div>
        <p className="text-sm text-gray-600">Email: {friendDetails.email}</p>

        <p className="text-sm text-gray-600">Status: Active</p>
      </div>
    </Skeleton>
  );
};

export default FriendDetails;
