"use client";

import { FC, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import axios from "axios";
import { SnapResponse } from "@/types/midtrans";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    snap: any;
  }
}

const MIDTRANS_SNAP_SCRIPT_ID = "midtrans-snap-script";

const UpgradePage: FC = () => {
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  // Function to dynamically load Midtrans Snap script if not already loaded
  const loadMidtransScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById(MIDTRANS_SNAP_SCRIPT_ID)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = MIDTRANS_SNAP_SCRIPT_ID;
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
      );
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Midtrans Snap SDK failed to load"));
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    if (!duration || !session?.accessToken) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/1.0.0/user/upgrade-premium`,
        { duration_months: duration },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success" && res.data.data?.token) {
        // Load Midtrans Snap script and open Snap popup
        await loadMidtransScript();

        window.snap.pay(res.data.data.token, {
          onSuccess: async function (result: SnapResponse) {
            alert("Payment success!");
            console.log("Success:", result);

            if (!result.order_id) {
              alert("No order_id found in payment result.");
              return;
            }

            try {
              const validateRes = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/1.0.0/user/validate-payment`,
                { order_id: result.order_id },
                {
                  headers: {
                    Authorization: `Bearer ${session?.accessToken}`, // if needed
                    "Content-Type": "application/json",
                  },
                }
              );

              if (validateRes.data.status === "success") {
                alert("Payment validated successfully!");
                router.push("/dashboard");
                // Maybe refresh user data or redirect to a thank you page
              } else {
                alert(
                  "Payment validation failed: " +
                    (validateRes.data.message || "")
                );
              }
            } catch (error) {
              console.error("Validation error:", error);
              alert("Failed to validate payment.");
            }
          },
          onPending: function (result: SnapResponse) {
            alert("Payment is pending!");
            console.log("Pending:", result);
          },
          onError: function (result: SnapResponse) {
            alert("Payment failed!");
            console.log("Error:", result);
          },
          onClose: function () {
            alert("You closed the payment popup without finishing.");
          },
        });
      } else {
        alert(res.data.message || "Failed to get payment token.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upgrade to Pro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Duration (Months)</Label>
            <Select onValueChange={(value) => setDuration(Number(value))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1} month{i + 1 > 1 && "s"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {duration && (
            <div className="text-sm text-muted-foreground">
              Total:{" "}
              <strong>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(duration * 10000)}
              </strong>{" "}
              ({duration} × Rp10.000/month)
            </div>
          )}

          <Button
            className="w-full"
            disabled={!duration || loading}
            onClick={handleUpgrade}
          >
            {loading ? "Processing..." : "Upgrade Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpgradePage;
