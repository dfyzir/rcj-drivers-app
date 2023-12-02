import { TrailerRCJ } from "@/API";

import {
  Button,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { format, parseISO } from "date-fns";
import { SetStateAction, useMemo } from "react";
import { ExpiredWarningIcon } from "../icons/ExpiredWarningIcon";
import { ExpireSoonWarningIcon } from "../icons/ExpireSoonWarningIcon";
import ViewButtonAWS from "../buttons/ViewButtonAWS";
import { useCheckDate } from "@/hooks/useCheckDate";
import SubscriptionDummy from "./SubscriptionDummy";

type TableProps = {
  trailers: TrailerRCJ[];
  setTrailers: (value: SetStateAction<TrailerRCJ[]>) => void;
};

const TableChassis = ({ trailers, setTrailers }: TableProps) => {
  const { isExpired, isExpireSoon } = useCheckDate();

  const classNames = useMemo(
    () => ({
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "text-2xl",
        "py-5",
        "pb-10",
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",

        "group-data-[middle=true]:before:rounded-none",

        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );
  return (
    <div className="container mx-auto mt-10 mb-10">
      <SubscriptionDummy setTrailers={setTrailers} />
      {trailers && (
        <div className="w-[90%] mx-auto ">
          <Table
            classNames={classNames}
            isStriped
            aria-label="Example static collection table">
            <TableHeader>
              <TableColumn key="chassisNumber" className="text-xl">
                CHASSIS #
              </TableColumn>

              <TableColumn
                key="vinNumber"
                className="text-xl hidden xl:table-cell">
                VIN
              </TableColumn>

              <TableColumn
                key="plateNumber"
                className="text-xl hidden lg:table-cell"
                align="end">
                PLATE #
              </TableColumn>

              <TableColumn
                key="inspectionExpiresAt"
                className="text-xl hidden md:table-cell">
                INSPECTION
              </TableColumn>

              <TableColumn
                key="registrationExpiresAt"
                className="text-xl hidden md:table-cell">
                REGISTRATION
              </TableColumn>

              <TableColumn key="documents" className="text-xl text-center">
                DOCUMENTS
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No chassis to display."} items={trailers}>
              {(item) => {
                const inspectionDate = new Date(
                  item.inspectionExpiresAt!
                ).toISOString();

                const registrationDate = new Date(
                  item.registrationExpiresAt!
                ).toISOString();

                const newItem = {
                  id: item.id,
                  chassisNumber: item.chassisNumber,
                  vinNumber: item.vinNumber,
                  plateNumber: item.plateNumber,
                  inspectionExpiresAt: item.inspectionExpiresAt ? (
                    <div
                      className={`flex gap-3 items-center ${
                        isExpired(inspectionDate) ? "text-red-600" : null
                      } ${
                        isExpireSoon(inspectionDate) ? "text-orange-500" : null
                      }`}>
                      {format(parseISO(item.inspectionExpiresAt), "PP")}

                      {isExpired(inspectionDate) ? (
                        <ExpiredWarningIcon />
                      ) : null}
                      {isExpireSoon(inspectionDate) ? (
                        <ExpireSoonWarningIcon />
                      ) : null}
                    </div>
                  ) : (
                    "N/A"
                  ),
                  registrationExpiresAt: item.registrationExpiresAt ? (
                    <div
                      className={`flex gap-3 items-center  ${
                        isExpired(registrationDate) ? "text-red-600" : null
                      } ${
                        isExpireSoon(registrationDate)
                          ? "text-orange-500"
                          : null
                      }`}>
                      {format(parseISO(item.registrationExpiresAt), "PP")}

                      {isExpired(registrationDate) ? (
                        <ExpiredWarningIcon />
                      ) : null}
                      {isExpireSoon(registrationDate) ? (
                        <ExpireSoonWarningIcon />
                      ) : null}
                    </div>
                  ) : (
                    "N/A"
                  ),
                  documents: (
                    <div className="text-center">
                      <ViewButtonAWS trailer={item} />
                    </div>
                  ),
                };
                return (
                  <TableRow className="" key={newItem.id}>
                    {(columnKey) => {
                      return (
                        <TableCell
                          className={`
                             
                            ${
                              columnKey !== "chassisNumber" &&
                              columnKey !== "documents"
                                ? "hidden"
                                : "table-cell"
                            }  md:${
                            columnKey === "vinNumber" ||
                            columnKey === "plateNumber"
                              ? "hidden"
                              : "table-cell"
                          } lg:${
                            columnKey === "vinNumber" ? "hidden" : "table-cell"
                          } xl:table-cell`}>
                          {getKeyValue(newItem, columnKey)}
                        </TableCell>
                      );
                    }}
                  </TableRow>
                );
              }}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TableChassis;
