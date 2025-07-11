import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { FaPlusSquare, FaRegTrashAlt } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

import { generateId } from "../../../lib";
import { createMessageSchema, ACCEPTED_ATTACHMENTS_TYPES } from "../schema";
import { useCreateMessage } from "../api/create-message";
import { File, Form, FormError, Input } from "../../../components/ui/form";
import { DropDownMenu } from "../../../components/ui/dropdown";
import { MessageAttachment } from "../../../components/ui/preview";
import { Button } from "../../../components/ui/button";

export default function CreateMessage({ chatId }) {
  const createMessage = useCreateMessage(chatId);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileRef = useRef();

  const onSubmit =
    ({ reset }) =>
    (data) => {
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

      reset();
      setSelectedFiles([]);
    };

  return (
    <Form
      id='create-message-form'
      schema={createMessageSchema}
      onSubmit={onSubmit}
      mode='onBlur'
      isCurried
    >
      {({ setValue, formState: { errors } }) => (
        <>
          <div>
            {selectedFiles?.length > 0 && (
              <div>
                <div>
                  {selectedFiles.map(({ id, file }) => (
                    <div key={id}>
                      <MessageAttachment attachment={file} />
                      <Button
                        type='button'
                        size='sm'
                        className='bg-contain bg-no-repeat p-15'
                        onClick={() => {
                          const files = Array.from(selectedFiles).filter((f) => f.id !== id);

                          setSelectedFiles(files);

                          setValue("attachments", files);
                        }}
                      >
                        <FaRegTrashAlt color='red' />
                      </Button>
                    </div>
                  ))}
                </div>
                {errors?.attachments && <FormError errorMessage={errors.attachments.message} />}
              </div>
            )}
          </div>
          <div>
            <DropDownMenu
              renderButtonTrigger={(options) => (
                <div>
                  <Button
                    type='button'
                    testId='drop-down-trigger'
                    onClick={options.onClick}
                    ref={options.triggerRef}
                  >
                    <FaPlusSquare />
                  </Button>
                </div>
              )}
            >
              <File
                name='attachments'
                label='Upload a File'
                testId='message-attachments'
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
                serverError={createMessage?.error}
                ref={fileRef}
                multiple
              />
            </DropDownMenu>

            <div>
              <Input
                type='text'
                name='content'
                className='border border-black'
                serverError={createMessage.error}
              />
            </div>

            <Button type='submit'>
              <IoIosSend />
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}

CreateMessage.propTypes = {
  chatId: PropTypes.string.isRequired,
};
