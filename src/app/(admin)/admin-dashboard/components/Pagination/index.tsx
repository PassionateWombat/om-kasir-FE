import { Button } from "@/components/ui/button";
import { PaginationRequest, PaginationResponse } from "@/types/pagination";
import { UserResponse } from "@/types/user";
import { FC } from "react";
interface PaginationProps {
  page: number;
  setPage: (page: number | ((prevPage: number) => number)) => void;
  params: PaginationRequest;
  setParams: (params: PaginationRequest) => void;
  users: PaginationResponse<UserResponse>;
}
const Pagination: FC<PaginationProps> = ({
  page,
  setPage,
  params,
  setParams,
  users,
}) => {
  const handlePageChange = (direction: 1 | -1) => {
    setPage((prevPage) => {
      const newPage = Math.max(prevPage + direction, 1);
      const newStart = (newPage - 1) * params.length;

      setParams({ ...params, start: newStart });

      return newPage;
    });
  };
  return (
    <div className="flex justify-between items-center mt-4">
      <p>
        Page {page} of{" "}
        {Math.ceil((users?.recordsFiltered ?? 1) / params.length)}
      </p>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handlePageChange(-1);
          }}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handlePageChange(1);
          }}
          disabled={
            page >= Math.ceil((users?.recordsFiltered ?? 1) / params.length)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};
export default Pagination;
