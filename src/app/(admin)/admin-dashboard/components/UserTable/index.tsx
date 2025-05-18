"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import useUsers from "@/hooks/useUsers";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import Pagination from "../Pagination";
import { UserResponse } from "@/types/user";
import BanModal from "../BanModal";
import UpgradeModal from "../UpgradeModal";
const UserTable: FC = () => {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);

  const { users, isLoading, error, params, setParams, refetch } = useUsers(
    session?.accessToken as string
  );
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    setPage(params.start / params.length + 1);
  }, [params]);

  const toggleSort = (field: string) => {
    if (params.field === field) {
      setParams({ ...params, order: params.order === "asc" ? "desc" : "asc" });
    } else {
      setParams({ ...params, field, order: "asc" });
    }
  };

  const handleUpgradeToggle = (userId: number) => {
    console.log(userId);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, search: e.target.value, start: 0 });
    setPage(1);
  };

  return (
    <>
      <TooltipProvider>
        <div className="mb-4 flex justify-between">
          <Input
            placeholder="Search by name or email"
            value={params.search}
            onChange={(e) => handleSearch(e)}
            className="w-[300px]"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer w-[120px]"
                onClick={() => toggleSort("name")}
              >
                Name{" "}
                {params.field === "name"
                  ? params.order === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("email")}
              >
                Email{" "}
                {params.field === "email"
                  ? params.order === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </TableHead>
              <TableHead>Premium Until</TableHead>
              <TableHead>Banned At</TableHead>
              <TableHead>Ban Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!users?.data?.length && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Error: {error.message}
                </TableCell>
              </TableRow>
            )}
            {users?.data?.map((user) => {
              const isPremium =
                user.premium_until && new Date(user.premium_until) > new Date();
              const isBanned = !!user.banned_at;

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell
                    className={cn(
                      isPremium ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {user.premium_until ?? "N/A"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      isBanned ? "text-red-500" : "text-muted-foreground"
                    )}
                  >
                    {user.banned_at ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.ban_reason ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowBanModal(true);
                          }}
                        >
                          {isBanned ? "Unban" : "Ban"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isBanned ? "Unban user" : "Ban user"}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUpgradeModal(true);
                          }}
                        >
                          {isPremium ? "Downgrade" : "Upgrade"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isPremium
                            ? "Downgrade from premium"
                            : "Upgrade to premium"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {users && (
          <Pagination
            page={page}
            setPage={setPage}
            setParams={setParams}
            params={params}
            users={users ?? {}}
          />
        )}
      </TooltipProvider>
      {showBanModal && (
        <BanModal
          setSelectedUser={setSelectedUser}
          refetch={refetch}
          selectedUser={selectedUser}
          setShowBanModal={setShowBanModal}
        />
      )}
      {showUpgradeModal && (
        <UpgradeModal
          setSelectedUser={setSelectedUser}
          refetch={refetch}
          selectedUser={selectedUser}
          setShowUpgradeModal={setShowUpgradeModal}
        />
      )}
    </>
  );
};

export default UserTable;
