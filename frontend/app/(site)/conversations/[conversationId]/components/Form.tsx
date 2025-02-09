"use client";

import socket from "@/app/context/SocketContext";
import useConversationHelper, {
  messageContentType,
} from "@/app/hooks/useConversation";
import { sendNewMessage } from "@/app/hooks/useMessage";
import clsx from "clsx";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";

interface Props {
  encryptMessageForSending: (message: string) => {
    messageEncryptedHexist: string;
    ivHexist: string;
  };
}

const Form: React.FC<React.PropsWithChildren<Props>> = ({
  encryptMessageForSending,
}) => {
  const { conversationId } = useConversationHelper();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setValue("message", "", { shouldValidate: false });
    const messagePrepared = encryptMessageForSending(data.message);
    sendNewMessage(socket, {
      content: messagePrepared.messageEncryptedHexist,
      convId: conversationId,
      content_type: messageContentType.TEXT,
      metadata: {
        iv: messagePrepared.ivHexist,
      },
    });
  };

  const [loading, setLoading] = useState(false);
  const handleUpload = async () => {
    setLoading(true);
    try {
      const img: HTMLInputElement | null =
        document.querySelector("#uploadfile");

      if (!img || !img.files) return;
      const file = img.files[0];

      if (file.size > 1024 * 300) {
        setLoading(false);
        return toast.error("max img is 300kb");
      }
      const fileuri: string | ArrayBuffer | null = await new Promise(
        (resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);

          reader.readAsDataURL(file);
        }
      );
      if (!fileuri || typeof fileuri != "string") return;

      setValue("message", "", { shouldValidate: false });
      const messagePrepared = encryptMessageForSending(fileuri);
      sendNewMessage(socket, {
        content: messagePrepared.messageEncryptedHexist,
        convId: conversationId,
        content_type: messageContentType.IMAGE,
        metadata: {
          iv: messagePrepared.ivHexist,
        },
      });
      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <label
        htmlFor="uploadfile"
        className={clsx("cursor-pointer", loading && "cursor-not-allowed")}
      >
        <HiPhoto
          size={30}
          className={clsx(
            "text-cyan-500 ",
            loading && "cursor-not-allowed text-gray-700"
          )}
        />
      </label>
      <input
        id="uploadfile"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.svg,.gif"
        className="hidden"
        onChange={handleUpload}
        disabled={loading}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-cyan-500 cursor-pointer hover:bg-cyan-600 transition"
        >
          <HiPaperAirplane size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
};
export default Form;
