import PrescriptionForm from "@/components/forms/prescription";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
export function DentalNoteUpdateDialog({
  isOpen,
  setIsOpen,
  treatmentId,
  id,
  updateMutation,
}) {
  return (
    <>
      {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-full">
          <DialogHeader>
            <DialogTitle>Update dental note.</DialogTitle>
            <DialogDescription>Update dental note.</DialogDescription>
          </DialogHeader>
          <PrescriptionForm
            treatmentId={treatmentId}
            closeDialog={setIsOpen}
            id={id}
            type="edit"
            updateMutation={updateMutation}
          />
        </DialogContent>
      </Dialog> */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Update dental note.</DrawerTitle>
            <DrawerDescription>Update dental note.</DrawerDescription>
            <PrescriptionForm
              treatmentId={treatmentId}
              closeDialog={setIsOpen}
              id={id}
              type="edit"
              updateMutation={updateMutation}
            />
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
}
