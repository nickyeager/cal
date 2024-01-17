import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { RouterOutputs, trpc } from "@calcom/trpc";
import { Button, Dialog, DialogContent, DialogFooter, Form, TextField } from "@calcom/ui";
import { PendingMember } from "~/ee/teams/lib/types";
import { MembershipRole } from "../../../../prisma/enums";

type InvitePlayerModalProps = {
  isOpen: boolean;
  teamId: number;
  token: string;
  expiresInDays?: number;
  onExit: () => void;
};
export interface NewMemberForm {
  emailOrUsername: string | string[];
  role: MembershipRole;
  sendInviteEmail: boolean;
}
type InvitePlayerModalProps = {
  isOpen: boolean;
  justEmailInvites?: boolean;
  onExit: () => void;
  orgMembers?: RouterOutputs["viewer"]["organizations"]["getMembers"];
  onSubmit: (values: NewMemberForm) => void;
  teamId: number;
  members?: PendingMember[];
  token?: string;
  isLoading?: boolean;
};





export default function InvitePlayerModal(props: InvitePlayerModalProps) {
  const { t } = useLocale();
  const trpcContext = trpc.useContext();
  const newMemberFormMethods = useForm<NewMemberForm>();
  const validateUniqueInvite = (value: string) => {
    if (!props?.members?.length) return true;
    return !(
      props?.members.some((member) => member?.username === value) ||
      props?.members.some((member) => member?.email === value)
    );
  };
  // const handleSubmit = (values) => {
  //   setInviteExpirationMutation.mutate({
  //     token: props.token,
  //     expiresInDays: values.expiresInDays,
  //   });
  // };


  // const createInviteMutation = trpc.viewer.teams.createInvite.useMutation({
  //   onSuccess(token) {
  //     copyInviteLinkToClipboard(token);
  //     trpcContext.viewer.teams.get.invalidate();
  //     trpcContext.viewer.teams.list.invalidate();
  //   },
  //   onError: (error) => {
  //     showToast(error.message, "error");
  //   },
  // });

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={() => {
        props.onExit();

      }}>
      <DialogContent type="creation" title="Signup for tournament">
        <Form form={newMemberFormMethods} handleSubmit={(values) => props.onSubmit(values)}>
          <Controller
            name="emailOrUsername"
            control={newMemberFormMethods.control}
            rules={{
              required: "An email had already been invited to the tournament",
              validate: (value) => {
                if (typeof value === "string")
                  return validateUniqueInvite(value) || "Already signed upu";
              },
            }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <>
                <TextField
                  label={props.justEmailInvites ? t("email") : t("email_or_username")}
                  id="inviteUser"
                  name="inviteUser"
                  placeholder="email@example.com"
                  required
                  onChange={(e) => onChange(e.target.value.trim().toLowerCase())}
                />
                {error && <span className="text-sm text-red-800">{error.message}</span>}
              </>
            )}
          />
          <DialogFooter showDivider className="mt-10">
            <Button
              type="button"
              color="minimal"
              onClick={() => {
                props.onExit();
              }}>
              {t("cancel")}
            </Button>
            <Button
              loading={props.isLoading}
              type="submit"
              color="primary"
              className="me-2 ms-2"
              data-testid="new-member-button">
              Sign Up
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
