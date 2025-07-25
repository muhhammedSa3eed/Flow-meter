import { Suspense } from "react";
import Loading from "@/app/loading";
import { Users } from "lucide-react";
import UserTable from "../../../../components/Data-Tables/UserTable";
import { User } from "@/types";
async function getAllUsers(): Promise<User[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/users`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}


export default async function Page() {
  const UsersData = await getAllUsers();
// console.log("Users :", UsersData)
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className=" flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <div>
              <Users />
            </div>
            <div className="text-xl font-bold  gap-2">Users </div>
          </div>
          <UserTable UsersData={UsersData} />
        </div>
      </div>
    </>
  );
}
