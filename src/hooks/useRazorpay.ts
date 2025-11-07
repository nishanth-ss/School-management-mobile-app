// src/hooks/useRazorpay.ts
import RazorpayCheckout from "react-native-razorpay"; // ✅ Correct import
import Toast from "react-native-toast-message";
import { createOrder, verifyPayment } from "../services/paymentService";

export const useRazorpay = () => {
  const startPayment = async (studentId: string, amount: number) => {
    try {
      const { order } = await createOrder(studentId, amount);
      console.log("Order ID:", order.id);

      const options = {
        key: "rzp_test_qXH0h7SCch7OVM",
        amount: order.amount,
        currency: order.currency ?? "INR",
        name: "Student Wallet",
        order_id: order.id,
        description: "Yearly subscription",
        theme: { color: "#40407a" },
        modal: { ondismiss: () => console.log("Payment dismissed") },
      };

      console.log("Opening Razorpay with:", options);

      // This will work now
      const data = await RazorpayCheckout.open(options);
      console.log("Payment Success:", data);

      await verifyPayment({
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      });

      Toast.show({ type: "success", text1: "Success", text2: "Subscribed!" });
      return true;
    } catch (error: any) {
      console.log("Razorpay Error:", error);

      if (error.code !== 0 && error.code !== "0") {
        Toast.show({
          type: "error",
          text1: "Payment Failed",
          text2: error.description || "Please try again",
        });
      }
      return false;
    }
  };

  return { startPayment };
};