import { Button } from "@/components/ui/button";
import { UserResponse } from "@/types/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface BanModalProps {
  setShowBanModal: (show: boolean) => void;
  selectedUser: UserResponse | null;
  setSelectedUser: (user: UserResponse | null) => void;
  refetch: () => void;
}

const BanModal: FC<BanModalProps> = ({
  setShowBanModal,
  selectedUser,
  setSelectedUser,
  refetch,
}) => {
  const { data: session } = useSession();

  const handleBanUser = async (user: UserResponse, reason?: string) => {
    const isBanned = !!user.banned_at;
    const url = isBanned
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/1.0.0/users/${user.id}/lift-ban`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/1.0.0/users/${user.id}/ban`;

    try {
      const { data } = await axios.post(
        url,
        isBanned ? {} : { ban_reason: reason },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      } else {
        console.log("An unexpected error occurred.");
      }
    } finally {
      setShowBanModal(false);
      setSelectedUser(null);
      refetch();
    }
  };

  if (!selectedUser) return null;

  const isUnbanning = !!selectedUser.banned_at;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {isUnbanning ? "Unban User" : "Ban User"}
        </h2>
        <p className="mb-4">
          Are you sure you want to {isUnbanning ? "unban" : "ban"} this user?
        </p>

        <Formik
          initialValues={{ reason: "" }}
          validationSchema={
            isUnbanning
              ? null
              : Yup.object({
                  reason: Yup.string()
                    .min(5, "Too short")
                    .max(200, "Too long")
                    .required("Ban reason is required"),
                })
          }
          onSubmit={async (values, { setSubmitting }) => {
            await handleBanUser(selectedUser, values.reason);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {!isUnbanning && (
                <div className="mb-4">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium mb-1"
                  >
                    Ban Reason
                  </label>
                  <Field
                    as="textarea"
                    id="reason"
                    name="reason"
                    className="w-full border rounded p-2"
                    rows={3}
                    placeholder="Enter reason for ban"
                  />
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="text-sm text-red-600 mt-1"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowBanModal(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Processing..."
                    : `Confirm ${isUnbanning ? "Unban" : "Ban"}`}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BanModal;
