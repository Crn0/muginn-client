import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { IoIosSend, IoMdAddCircleOutline } from "react-icons/io";

import { CustomError } from "../../../errors";
import { generateId } from "../../../lib";
import { createMessageSchema, ACCEPTED_ATTACHMENTS_TYPES, MAX_CONTENT_LENGTH } from "../schema";
import { useCreateMessage } from "../api/create-message";
import { File as InputFile, Form, FormError, TextArea } from "../../../components/ui/form";
import { FileAttachment } from "../../../components/ui/preview";
import { Button } from "../../../components/ui/button";

const TEXTAREA_MAX_LEN = MAX_CONTENT_LENGTH;

function FormChildren({ selectedFiles, setSelectedFiles, serverError, isPending, isSuccess }) {
  const {
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fileRef = useRef();

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
              <FormError errorMessage={errors.attachments.message} className='text-lg' />
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
          onKeyDown={(e) => e.code === "Enter" && fileRef.current.click()}
          onChange={(e) => {
            const files = Array.from(e.target.files).map((file) => ({
              file,
              id: generateId(),
            }));

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
          type='text'
          name='content'
          placeholder='Message'
          rows='1'
          maxLength={TEXTAREA_MAX_LEN}
          className='flex-1 resize-none border-none shadow-none outline-none'
          serverError={serverError}
          onChange={(e) => {
            setValue("content", e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />

        <Button type='submit' isLoading={isPending} disabled={disableSubmitButton || isPending}>
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
}

export default function CreateMessage({ chatId }) {
  const createMessage = useCreateMessage(chatId);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        return value.forEach((v) => formData.append(key, v));
      }
      if (typeof value === "object") {
        return formData.append(key, JSON.stringify(value));
      }

      return formData.append(key, value);
    });

    createMessage.mutate(formData);
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

CreateMessage.propTypes = {
  chatId: PropTypes.string.isRequired,
};

FormChildren.propTypes = {
  selectedFiles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      file: PropTypes.instanceOf(File),
    })
  ),
  setSelectedFiles: PropTypes.func.isRequired,
  serverError: PropTypes.instanceOf(CustomError),
  isSuccess: PropTypes.bool.isRequired,
  isPending: PropTypes.bool.isRequired,
};
