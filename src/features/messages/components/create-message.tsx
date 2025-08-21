import { useFormContext } from "react-hook-form";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { IoIosSend, IoMdAddCircleOutline } from "react-icons/io";

import { ValidationError } from "@/errors";
import { generateId } from "@/lib";
import {
  useCreateMessage,
  createMessageSchema,
  ACCEPTED_ATTACHMENTS_TYPES,
  MAX_CONTENT_LENGTH,
  type TCreateMessage,
} from "../api";
import { File as InputFile, Form, ErrorMessage, TextArea } from "@/components/ui/form";
import { FileAttachment } from "@/components/ui/preview";
import { Button } from "@/components/ui/button";

const TEXTAREA_MAX_LEN = MAX_CONTENT_LENGTH;

function FormChildren({
  selectedFiles,
  setSelectedFiles,
  serverError,
  isPending,
  isSuccess,
}: {
  selectedFiles: { id: string; file: File }[];
  setSelectedFiles: Dispatch<SetStateAction<{ id: string; file: File }[]>>;
  serverError: InstanceType<typeof ValidationError> | null;
  isPending: boolean;
  isSuccess: boolean;
}) {
  const {
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSuccess) {
      reset();
      setSelectedFiles([]);
    }
  }, [isSuccess, reset, setSelectedFiles]);

  const disableSubmitButton = watch("attachments")?.length === 0 && !watch("content")?.trim?.();

  return (
    <div className='grid border-1 border-slate-900 p-1'>
      {selectedFiles?.length > 0 && (
        <>
          <div className='sm:scrollbar flex overflow-x-auto'>
            {selectedFiles.map(({ id, file }) => (
              <FileAttachment
                key={id}
                attachment={file}
                onRemove={() => {
                  const files = Array.from(selectedFiles).filter((f) => f.id !== id);

                  setSelectedFiles(files);
                  setValue(
                    "attachments",
                    files.map((ob) => ob.file)
                  );
                }}
              />
            ))}
          </div>

          <div>
            {errors?.attachments && (
              <ErrorMessage message={errors.attachments.message?.toString()} className='text-lg' />
            )}
          </div>
        </>
      )}

      <div className='flex items-center-safe justify-center-safe p-5'>
        <InputFile
          testId='message-attachments'
          name='attachments'
          className='flex h-9 items-center justify-center rounded-md text-3xl font-medium whitespace-nowrap text-white transition-colors hover:opacity-75 focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
          label={<IoMdAddCircleOutline />}
          accept={ACCEPTED_ATTACHMENTS_TYPES.join(",")}
          pressKey={(e) => e.code === "Enter" && fileRef.current?.click()}
          onChange={(e) => {
            const files = e.currentTarget.files
              ? Array.from(e.currentTarget.files).map((file) => ({
                  file,
                  id: generateId(),
                }))
              : [];

            setValue(
              "attachments",
              selectedFiles.concat(files).map(({ file }) => file)
            );

            setSelectedFiles((prev) => prev.concat(files));
          }}
          serverError={serverError}
          ref={fileRef}
          showError={false}
          multiple
        />

        <TextArea
          label={null}
          name='content'
          placeholder='Message'
          className='w-full'
          rows={1}
          maxLength={TEXTAREA_MAX_LEN}
          variant='message'
          serverError={serverError}
          onChange={(e) => {
            setValue("content", e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          style={{ ...(isSuccess ? { height: "auto" } : {}) }}
        />

        <Button type='submit' isLoading={isPending} disabled={disableSubmitButton || isPending}>
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
}

export function CreateMessage({ chatId }: { chatId: string }) {
  const createMessage = useCreateMessage(chatId);
  const [selectedFiles, setSelectedFiles] = useState<{ id: string; file: File }[]>([]);

  const onSubmit = (data: TCreateMessage) => {
    createMessage.mutate(data);
  };

  return (
    <Form id='create-message-form' schema={createMessageSchema} onSubmit={onSubmit} mode='onBlur'>
      <FormChildren
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        serverError={createMessage.error}
        isSuccess={createMessage.isSuccess}
        isPending={createMessage.isPending}
      />
    </Form>
  );
}
