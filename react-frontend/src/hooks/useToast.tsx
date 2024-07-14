import { useState, useEffect } from "react";

import CloseIcon from "@mui/icons-material/Close";
import Card from "../components/wrappers/Card";

const toastColorMap: { [key: string]: string } = {
  success: "#22bb33",
  error: "#bb2124",
};

const useToast = (duration = 60000) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [toastLevel, setToastLevel] = useState("success");

  const openToast = ({
    toastMessage,
    toastLevel
  }: {
    toastMessage: string;
    toastLevel: string;
  }) => {
    setMessage(toastMessage);
    setIsOpen(true);
    setToastLevel(toastLevel);
  };

  const closeToast = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // auto close the toast after the duration
    if (isOpen) {
      const timer = setTimeout(() => {
        closeToast();
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, duration]);

  const getToastColor = () => {
    return toastColorMap[toastLevel];
  };

  const ToastModal = () => (
    <>
      {isOpen && (
        <Card
          className="flex flex-col"
          style={{
            top: 16,
            right: 16,
            position: "fixed",
            padding: 0,
            borderRadius: 0,
          }}
        >
          <div
            className="flex p-2 justify-between"
            style={{ backgroundColor: getToastColor() }}
          >
            <span className="ml-2 text-white">{toastLevel.toUpperCase()}</span>
            <CloseIcon
              sx={{ color: "white" }}
              className="hover:cursor-pointer"
              onClick={closeToast}
            />
          </div>

          <div className="h-[1px] bg-slate-300 mx-1" />

          <div className="p-2">
            <p>{message}</p>
          </div>
        </Card>
      )}
    </>
  );

  return {
    openToast,
    ToastModal,
  };
};

export default useToast;
