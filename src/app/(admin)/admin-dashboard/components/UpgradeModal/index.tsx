import { Button } from "@/components/ui/button";
import { UserResponse } from "@/types/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface UpgradeModalProps {
  setShowUpgradeModal: (show: boolean) => void;
  selectedUser: UserResponse | null;
  setSelectedUser: (user: UserResponse | null) => void;
  refetch: () => void;
}

const UpgradeModal: FC<UpgradeModalProps> = ({
  setShowUpgradeModal,
  selectedUser,
  setSelectedUser,
  refetch,
}) => {
  const { data: session } = useSession();

  const handleUpgradeUser = async (
    user: UserResponse,
    values: { duration_months?: number; until_date?: string }
  ) => {
    const isPremium = !!user.premium_until;

    const url = isPremium
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/1.0.0/users/${user.id}/downgrade`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/1.0.0/users/${user.id}/upgrade-premium`;

    try {
      const { data } = await axios.post(url, values, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      alert(data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.message);
      } else {
        console.error("An unexpected error occurred.");
      }
    } finally {
      setShowUpgradeModal(false);
      setSelectedUser(null);
      refetch();
    }
  };

  if (!selectedUser) return null;

  const isDowngrading = !!selectedUser.premium_until;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {isDowngrading ? "Downgrade User" : "Upgrade User"}
        </h2>
        <p className="mb-4">
          Are you sure you want to {isDowngrading ? "downgrade" : "upgrade"}{" "}
          this user?
        </p>

        <Formik
          initialValues={{
            duration_months: "",
            until_date: "",
          }}
          validationSchema={
            isDowngrading
              ? null
              : Yup.object().shape({
                  until_date: Yup.date()
                    .nullable()
                    .transform((v, o) => (o === "" ? null : v))
                    .required("Until date is required")
                    .min(new Date(), "Date must be in the future"),
                })
          }
          onSubmit={async (values, { setSubmitting }) => {
            const payload: any = {};

            // if (values.duration_months)
            //   payload.duration_months = Number(values.duration_months);
            if (values.until_date) payload.until_date = values.until_date;

            await handleUpgradeUser(selectedUser, payload);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {!isDowngrading && (
                <>
                  <div className="mb-4">
                    <label
                      htmlFor="until_date"
                      className="block text-sm font-medium mb-1"
                    >
                      Until Date
                    </label>
                    <Field
                      type="date"
                      name="until_date"
                      className="w-full border rounded p-2"
                    />
                    <ErrorMessage
                      name="until_date"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowUpgradeModal(false);
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
                    : `Confirm ${isDowngrading ? "Downgrade" : "Upgrade"}`}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpgradeModal;
