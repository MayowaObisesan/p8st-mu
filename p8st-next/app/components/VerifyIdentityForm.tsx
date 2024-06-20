import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { DiscordIcon } from "@/components/icons";
import { LucideLinkedin } from "lucide-react";

export default function VerifyIdentity() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Verify POH</Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 py-8">
                Verify your Proof of Humanity
              </ModalHeader>
              <ModalBody className="flex flex-col gap-y-8">
                <div className="flex flex-row items-center gap-x-8">
                  <Card className="group py-4 hover:bg-green-600/60 transition cursor-pointer">
                    <CardBody className="items-center overflow-visible py-2">
                      <DiscordIcon size={96} className="text-indigo-500 group-hover:text-default-900 transition" />
                    </CardBody>
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                      {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
                    <small className="text-default-500">12 Tracks</small> */}
                      <h4 className="font-bold text-large text-center">
                        Verify using Discord
                      </h4>
                    </CardHeader>
                  </Card>

                  <Card className="group py-4 hover:bg-green-600/60 transition cursor-pointer">
                    <CardBody className="items-center overflow-visible py-2">
                      <LucideLinkedin size={96} className="text-blue-500 group-hover:text-default-900 transition" />
                    </CardBody>
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                      {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
                    <small className="text-default-500">12 Tracks</small> */}
                      <h4 className="font-bold text-large text-center">
                        Verify using LinkedIn
                      </h4>
                    </CardHeader>
                  </Card>
                </div>
                <p className="italic text-center text-sm text-default-500 py-4">
                  Select either of the above for you <b>ZK</b> Proof of Humanity Check
                </p>
              </ModalBody>
              {/* <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
