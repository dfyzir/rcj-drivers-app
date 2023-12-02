import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { format, parseISO } from "date-fns";
import { getUrl } from "aws-amplify/storage";
import { TrailerRCJ } from "@/API";

import Link from "next/link";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { DownloadIcon } from "../icons/DownloadIcon";
import { ViewIcon } from "../icons/ViewIcon";

import dynamic from "next/dynamic";
import { useCheckDate } from "@/hooks/useCheckDate";

const DynamicPDFViewer = dynamic(() => import("../PDFViewer"), {
  ssr: false,
});

const ViewButtonAWS = ({ trailer }: { trailer: TrailerRCJ }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [inspectionUrl, setInspectionUrl] = useState<string>();
  const [registrationUrl, setRegistrationUrl] = useState<string>();

  const { isExpired, isExpireSoon } = useCheckDate();

  useEffect(() => {
    const getSignedLinks = async () => {
      const inspectionLink = trailer.inspectionFile
        ? await getUrl({ key: trailer.inspectionFile })
        : null;

      const registrationLink = trailer.registrationFile
        ? await getUrl({ key: trailer.registrationFile })
        : null;

      inspectionLink ? setInspectionUrl(inspectionLink.url.href) : null;

      registrationLink ? setRegistrationUrl(registrationLink.url.href) : null;
    };
    getSignedLinks();
  }, [trailer.inspectionFile, trailer.registrationFile]);

  const EmptyDiv = useMemo(() => {
    return (
      <>
        {!inspectionUrl && !registrationUrl && (
          <div className="my-auto  text-red-500 mx-auto p-5 h-auto items-center text-center text-xl md:text-4xl rounded-xl">
            No files to show
            <a href="tel:+17133559421">
              <p className="text-blue-600 text-sm md:text-xl mt-5">
                Contact office
              </p>
            </a>
          </div>
        )}
      </>
    );
  }, [inspectionUrl, registrationUrl]);

  const InspectionFile = () => {
    return (
      <>
        {trailer.inspectionFile && inspectionUrl && (
          <div className=" mx-auto">
            <div className="flex justify-evenly ">
              <h3 className="text-center mb-4 text-xl font-semibold uppercase">
                Inspection
              </h3>
              <Link
                href={inspectionUrl}
                target="_blank"
                aria-label="Download"
                title="Download">
                <DownloadIcon size={50} className="w-10 h-10" />
              </Link>
            </div>
            {trailer.inspectionFile && (
              <DynamicPDFViewer pdfUrl={inspectionUrl} />
            )}
            {trailer.inspectionExpiresAt ? (
              <h3
                className={`text-center mt-4 text-xl font-semibold ${
                  isExpired(trailer.inspectionExpiresAt) ? "text-red-500" : null
                }`}>
                {isExpired(trailer.inspectionExpiresAt!)
                  ? "Expired"
                  : `Expires on ${format(
                      parseISO(trailer.inspectionExpiresAt),
                      "PP"
                    )}`}
              </h3>
            ) : null}
          </div>
        )}
      </>
    );
  };

  const RegistrationFile = () => {
    return (
      <>
        {trailer.registrationFile && registrationUrl && (
          <div className=" mx-auto ">
            <div className="flex justify-evenly">
              <h3 className="text-center mb-4 text-xl font-semibold uppercase">
                Registration
              </h3>
              <Link
                href={registrationUrl}
                target="_blank"
                aria-label="Download"
                title="Download">
                <DownloadIcon size={50} className="w-10 h-10" />
              </Link>
            </div>
            <div className="w-full h-full rounded-xl">
              <DynamicPDFViewer pdfUrl={registrationUrl} />

              {trailer.registrationExpiresAt ? (
                <h3
                  className={`text-center mt-4 text-xl font-semibold ${
                    isExpired(trailer.registrationExpiresAt)
                      ? "text-red-500"
                      : null
                  }`}>
                  {isExpired(trailer.registrationExpiresAt!)
                    ? "Expired"
                    : `Expires on ${format(
                        parseISO(trailer.registrationExpiresAt),
                        "PP"
                      )}`}
                </h3>
              ) : null}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="container">
      <Button
        className="bg-white"
        isIconOnly
        variant="light"
        color="secondary"
        title="Details"
        onPress={onOpen}>
        <ViewIcon />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        size="5xl"
        scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="px-5 w-full h-full mt-5 container">
                  <div className="flex flex-col md:flex-row gap-20 md:gap-10 mt-5 mx-auto">
                    {EmptyDiv}
                    <InspectionFile />

                    <RegistrationFile />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="my-5 mr-10 flex gap-5 items-center">
                  <Button
                    className="text-2xl"
                    variant="light"
                    color="danger"
                    onPress={onClose}>
                    Close
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default ViewButtonAWS;
