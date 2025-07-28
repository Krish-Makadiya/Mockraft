import axios from "axios";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the path if needed
import toast from "react-hot-toast";

// You may need to pass user and setUserPlan as arguments or import them from context

const paymentSignatureValidation = async (
    response,
    orderId,
    amount,
    createdAt,
    user,
    setUserPlan
) => {
    if (!user) {
        toast.error("You need to be logged in to make a payment.");
        return;
    }

    try {
        const isValid = await axios.post(
            "http://localhost:4000/payment/verify-signature",
            {
                order_id: orderId,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Payment signature validation response:", isValid.data);

        const userRef = doc(db, "users", user.id);

        // Remove the pending payment and add the updated one
        const oldPayment = {
            orderId: orderId,
            amount: amount,
            status: "pending",
            createdAt: createdAt,
        };
        const newPayment = {
            orderId: orderId,
            amount: amount,
            status: isValid.data.success ? "success" : "failed",
            createdAt: createdAt,
            updatedAt: new Date().toISOString(),
        };
        await updateDoc(userRef, {
            payments: arrayRemove(oldPayment),
        });
        await updateDoc(userRef, {
            payments: arrayUnion(newPayment),
        });

        if (isValid.data.success) {
            await updateDoc(userRef, {
                plan: "paid",
            });
            if (setUserPlan) setUserPlan("paid");
            toast.success("Payment successful!");
            user.plan = "paid";
        } else {
            toast.error("Payment failed. Please try again.");
            return;
        }
        return isValid.data;
    } catch (error) {
        console.error("Error validating payment signature:", error);
    }
};

const paymentHandler = async (price, user, setUserPlan) => {
    console.log("Payment amount:", price);
    console.log("User data:", user);

    if (!user) {
        toast.error("You need to be logged in to make a payment.");
        return;
    }

    try {
        const response = await axios.post(
            "http://localhost:4000/payment/create-order",
            { amount: price },
            { headers: { "Content-Type": "application/json" } }
        );
        console.log("Payment order response:", response.data);

        const paymentData = {
            orderId: response.data.id,
            amount: response.data.amount,
            status: "pending",
            createdAt: new Date().toISOString(),
        };
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
            payments: arrayUnion(paymentData),
        });

        var options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: response.data.amount,
            currency: "INR",
            name: "Mockraft",
            description: "Placement Preparation Platform",
            image: "/logo-dark-bnw.png",
            order_id: response.data.id,
            handler: (res) =>
                paymentSignatureValidation(
                    res,
                    response.data.id,
                    response.data.amount,
                    paymentData.createdAt,
                    user,
                    setUserPlan
                ),
            prefill: {
                name: user.fullName || user.firstName,
                email: user.emailAddresses[0].emailAddress,
                contact: "",
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            modal: {
                ondismiss: async function () {
                    // Find the pending payment to remove
                    const pendingPayment = {
                        orderId: response.data.id,
                        amount: response.data.amount,
                        status: "pending",
                        createdAt: paymentData.createdAt,
                    };
                    const failedPayment = {
                        orderId: response.data.id,
                        amount: response.data.amount,
                        status: "failed",
                        createdAt: paymentData.createdAt,
                        updatedAt: new Date().toISOString(),
                    };
                    // Remove pending, then add failed
                    await updateDoc(userRef, {
                        payments: arrayRemove(pendingPayment),
                    });
                    await updateDoc(userRef, {
                        payments: arrayUnion(failedPayment),
                    });
                    toast.error("Payment was cancelled or failed.");
                },
            },
            theme: {
                color: "#3399cc",
            },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    } catch (error) {
        console.error("Error creating payment order:", error);
    }
};

export { paymentHandler, paymentSignatureValidation };
