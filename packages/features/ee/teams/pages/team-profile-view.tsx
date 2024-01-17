import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useOrgBranding } from "@calcom/features/ee/organizations/context/provider";
import { getOrgFullDomain } from "@calcom/features/ee/organizations/lib/orgDomains";
import { IS_TEAM_BILLING_ENABLED, WEBAPP_URL } from "@calcom/lib/constants";
import { getPlaceholderAvatar } from "@calcom/lib/defaultAvatarImage";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { useParamsWithFallback } from "@calcom/lib/hooks/useParamsWithFallback";
import { md } from "@calcom/lib/markdownIt";
import { markdownToSafeHTML } from "@calcom/lib/markdownToSafeHTML";
import objectKeys from "@calcom/lib/objectKeys";
import slugify from "@calcom/lib/slugify";
import turndown from "@calcom/lib/turndownService";
import { MembershipRole, TournamentType } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import {
  Avatar,
  Button,
  ConfirmationDialogContent,
  DatePicker,
  Dialog,
  DialogTrigger,
  Editor,
  Form,
  ImageUploader,
  Label,
  LinkIconButton,
  Meta,
  Select,
  showToast,
  SkeletonContainer,
  SkeletonText,
  TextField,
} from "@calcom/ui";
import { ExternalLink, Link as LinkIcon, LogOut, Trash2, ThumbsUp, StopCircle } from "@calcom/ui/components/icon";

import dayjs from "../../../../dayjs";
import { getLayout } from "../../../settings/layouts/SettingsLayout";
import { Start } from "twilio/lib/twiml/VoiceResponse";

const regex = new RegExp("^[a-zA-Z0-9-]*$");

const teamProfileFormSchema = z.object({
  name: z.string(),
  slug: z
    .string()
    .regex(regex, {
      message: "Url can only have alphanumeric characters(a-z, 0-9) and hyphen(-) symbol.",
    })
    .min(1, { message: "Url cannot be left empty" }),
  logo: z.string(),
  bio: z.string(),
  start_time: z.string(),
  start_date: z.string(),
  slots: z.number(),
  type: z.string(),
});

const ProfileView = () => {
  const params = useParamsWithFallback();
  const teamId = Number(params.id);
  const { t } = useLocale();
  const router = useRouter();
  const utils = trpc.useContext();
  const session = useSession();
  const [firstRender, setFirstRender] = useState(true);
  const orgBranding = useOrgBranding();

  useLayoutEffect(() => {
    document.body.focus();
  }, []);




  const mutation = trpc.viewer.teams.update.useMutation({
    onError: (err) => {
      showToast(err.message, "error");
    },
    async onSuccess() {
      await utils.viewer.teams.get.invalidate();
      showToast("Your tournament was updated successfully", "success");
    },
  });

  const defaultStartTime = "09:00";

  const form = useForm({
    resolver: zodResolver(teamProfileFormSchema),
  });

  const { data: team, isLoading } = trpc.viewer.teams.get.useQuery(
    { teamId, includeTeamLogo: true },
    {
      enabled: !!teamId,
      onError: () => {
        router.push("/settings");
      },
      onSuccess: (team) => {
        if (team) {
          form.setValue("name", team.name || "");
          form.setValue("slug", team.slug || "");
          form.setValue("bio", team.bio || "");
          form.setValue("logo", team.logo || "");
          form.setValue("start_time", team?.tournament?.startTime || defaultStartTime);
          form.setValue("start_date", team?.tournament?.startDate || "");
          form.setValue("type", team?.tournament?.type || "");
          form.setValue("slots", Number(team.tournament?.slots) || "");
          if (team.slug === null && (team?.metadata as Prisma.JsonObject)?.requestedSlug) {
            form.setValue("slug", ((team?.metadata as Prisma.JsonObject)?.requestedSlug as string) || "");
          }
        }
      },
    }
  );

  const isAdmin =
    team && (team.membership.role === MembershipRole.OWNER || team.membership.role === MembershipRole.ADMIN);

  const permalink = `${WEBAPP_URL}/team/${team?.slug}`;
  const isBioEmpty = !team || !team.bio || !team.bio.replace("<p><br></p>", "").length;
  const deleteTeamMutation = trpc.viewer.teams.delete.useMutation({
    async onSuccess() {
      await utils.viewer.teams.list.invalidate();
      showToast("Your tournament has been updated", "success");
      router.push(`${WEBAPP_URL}/teams`);
    },
  });

  const removeMemberMutation = trpc.viewer.teams.removeMember.useMutation({
    async onSuccess() {
      await utils.viewer.teams.get.invalidate();
      await utils.viewer.teams.list.invalidate();
      await utils.viewer.eventTypes.invalidate();
      showToast(t("success"), "success");
    },
    async onError(err) {
      showToast(err.message, "error");
    },
  });

  const publishMutation = trpc.viewer.teams.publish.useMutation({
    async onSuccess(data: { url?: string }) {
      if (data.url) {
        router.push(data.url);
      }
    },
    async onError(err) {
      showToast(err.message, "error");
    },
  });

  function deleteTeam() {
    if (team?.id) deleteTeamMutation.mutate({ teamId: team.id });
  }

  function leaveTeam() {
    if (team?.id && session.data)
      removeMemberMutation.mutate({
        teamId: team.id,
        memberId: session.data.user.id,
      });
  }

  const timeOptions = Array.from({ length: 24 }, (_, index) => {
    const hour = index < 10 ? `0${index}` : index;
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  const tournamentOptions = Object.entries(TournamentType).map(([key, value]) => ({
    value: value,
    label: key.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
  }));

  const startOrStopMutation = trpc.viewer.teams.startOrStop.useMutation({
    onSuccess: async () => {
      showToast(t("success"), "success");
      await utils.viewer.teams.get.invalidate();
      // await utils.viewer.teams.hasTeamPlan.invalidate();
      // await utils.viewer.teams.list.invalidate();
      // await utils.viewer.organizations.listMembers.invalidate();
    },
  });

  function startOrStop(accept: boolean) {

    startOrStopMutation.mutate({
      tournamentId: team?.tournament.id as number,
      started: accept,
    });
  }

  const toggleTournamentStarted = () => startOrStop(team?.tournament.started ? false : true);

  return (
    <>
      <Meta title="Tournament" description="Tournament information" />
      {!isLoading ? (
        <>
          {isAdmin ? (
            <Form
              form={form}
              handleSubmit={(values) => {
                if (team) {
                  const variables = {
                    name: values.name,
                    slug: values.slug,
                    bio: values.bio,
                    logo: values.logo,
                    startTime: values.start_time,
                    startDate: values.start_date,
                    type: values.type,
                    slots: Number(values.slots),
                    tournamentId: team?.tournament?.id
                  };
                  objectKeys(variables).forEach((key) => {
                    if (variables[key as keyof typeof variables] === team?.[key]) delete variables[key];
                  });
                  mutation.mutate({ id: team.id, ...variables });
                }
              }}>
              {!team.parent && (
                <>
                  <div className="flex items-center">
                    <Controller
                      control={form.control}
                      name="logo"
                      render={({ field: { value } }) => (
                        <>
                          <Avatar
                            alt=""
                            imageSrc={getPlaceholderAvatar(value, team?.name as string)}
                            size="lg"
                          />
                          <div className="ms-4">
                            <ImageUploader
                              target="avatar"
                              id="avatar-upload"
                              buttonMsg={t("update")}
                              handleAvatarChange={(newLogo) => {
                                form.setValue("logo", newLogo);
                              }}
                              imageSrc={value}
                            />
                          </div>
                        </>
                      )}
                    />
                  </div>
                  <hr className="border-subtle my-8" />
                </>
              )}
              <Controller
                control={form.control}
                name="name"
                render={({ field: { value } }) => (
                  <div className="mt-8">
                    <TextField
                      name="name"
                      label="Tournament Name"
                      value={value}
                      onChange={(e) => {
                        form.setValue("name", e?.target.value);
                      }}
                    />
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name="slug"
                render={({ field: { value } }) => (
                  <div className="mt-8">
                    <TextField
                      name="slug"
                      label="Tournament url"
                      value={value}
                      addOnLeading={
                        team.parent && orgBranding
                          ? `${getOrgFullDomain(orgBranding?.slug, { protocol: false })}/`
                          : `${WEBAPP_URL}/team/`
                      }
                      onChange={(e) => {
                        form.clearErrors("slug");
                        form.setValue("slug", slugify(e?.target.value, true));
                      }}
                    />
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <div className="mt-8">
                    <Label>Start Date</Label>
                    <DatePicker
                      minDate={new Date()}
                      date={field.value ? new Date(field.value) : new Date()} // Convert the string back to a Date object
                      onDatesChange={(newDate) => {
                        const dateValue = newDate ? dayjs(newDate).format("YYYY-MM-DD") : null;
                        field.onChange(dateValue); // Update React Hook Form's state when date changes
                      }}
                      disabled={false} // Optional: Set to true to disable the date picker
                    />
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="type"
                render={({ field }) => {
                  return (
                    <div className="mt-8">
                      <Label>Tournament Type</Label>
                      <Select
                        placeholder="Type"
                        options={tournamentOptions}
                        defaultValue={timeOptions.find((option) => option.value === "ROUND_ROBIN")} // Set default value here
                        isSearchable={true}
                        value={tournamentOptions.find((option) => option.value === field.value)} // Set the value from RHF state
                        onChange={(selected) => {
                          field.onChange(selected ? selected.value : ""); // Update RHF state
                        }}
                        className="block w-full min-w-0 flex-1 rounded-sm text-sm "
                      />
                    </div>
                  );
                }}
              />
              <Controller
                control={form.control}
                name="start_time"
                render={({ field }) => {
                  return (
                    <div className="mt-8">
                      <Label>Start Time</Label>
                      <Select
                        placeholder="Start Time"
                        options={timeOptions}
                        defaultValue={timeOptions.find((option) => option.value === "09:00")} // Set default value here
                        isSearchable={true}
                        value={timeOptions.find((option) => option.value === field.value)} // Set the value from RHF state
                        onChange={(selected) => {
                          field.onChange(selected ? selected.value : ""); // Update RHF state
                        }}
                        className="block w-full min-w-0 flex-1 rounded-sm text-sm "
                      />
                    </div>
                  );
                }}
              />
              <Controller
                control={form.control}
                name="slots"
                render={({ field: { value } }) => (
                  <div className="mt-8">
                    <TextField
                      type="number"
                      name="slots"
                      label="Number of slots"
                      value={value}
                      defaultValue={8}
                      onChange={(e) => {
                        form.setValue("slots", e?.target.valueAsNumber);
                      }}
                    />
                  </div>
                )}
              />
              <div className="mt-8">
                <Label>{t("about")}</Label>
                <Editor
                  getText={() => md.render(form.getValues("bio") || "")}
                  setText={(value: string) => form.setValue("bio", turndown(value))}
                  excludedToolbarItems={["blockType"]}
                  disableLists
                  firstRender={firstRender}
                  setFirstRender={setFirstRender}
                />
              </div>
              <p className="text-default mt-2 text-sm" >Describe the tournament in a few words. This will appear on your tournament page.</p>
              <Button color="primary" className="mt-8" type="submit" loading={mutation.isLoading}>
                {t("update")}
              </Button>
              {IS_TEAM_BILLING_ENABLED &&
                team.slug === null &&
                (team.metadata as Prisma.JsonObject)?.requestedSlug && (
                  <Button
                    color="secondary"
                    className="ml-2 mt-8"
                    type="button"
                    onClick={() => {
                      publishMutation.mutate({ teamId: team.id });
                    }}>
                    Publish
                  </Button>
                )}
            </Form>
          ) : (
            <div className="flex">
              <div className="flex-grow">
                <div>
                  <Label className="text-emphasis">{t("team_name")}</Label>
                  <p className="text-default text-sm">{team?.name}</p>
                </div>
                {team && !isBioEmpty && (
                  <>
                    <Label className="text-emphasis mt-5">{t("about")}</Label>
                    <div
                      className="  text-subtle break-words text-sm [&_a]:text-blue-500 [&_a]:underline [&_a]:hover:text-blue-600"
                      dangerouslySetInnerHTML={{ __html: md.render(markdownToSafeHTML(team.bio)) }}
                    />
                  </>
                )}
              </div>
              <div className="">
                <Link href={permalink} passHref={true} target="_blank">
                  <LinkIconButton Icon={ExternalLink}>{t("preview")}</LinkIconButton>
                </Link>
                <LinkIconButton
                  Icon={LinkIcon}
                  onClick={() => {
                    navigator.clipboard.writeText(permalink);
                    showToast("Copied to clipboard", "success");
                  }}>
                  Copy the link to the tournament
                </LinkIconButton>
              </div>
            </div>
          )}
          <hr className="border-subtle my-8 border" />
          {team?.membership.role === "OWNER" && (
            <div>
              <div className="text-default mb-3 text-base font-semibold">Tournament Management</div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button color="destructive" className="border" StartIcon={team?.tournament?.started ? StopCircle : ThumbsUp}>
                    {team?.tournament?.started ? "Stop" : "Start"} tournament
                  </Button>
                </DialogTrigger>
                <ConfirmationDialogContent
                  variety="warning"
                  title={team?.tournament?.started ? "Stop tournament" : "Start tournament"}
                  confirmBtnText={team?.tournament?.started ? "Stop Tournament" : "Start Tournament"}
                  onConfirm={toggleTournamentStarted}>
                  {team?.tournament?.started ? "Stopping the tournament will change the current view and will end all matches ." : "Starting a tournament "}
                </ConfirmationDialogContent>
              </Dialog>
            </div>
            )}

            <hr className="border-subtle my-8 border" />

          <div className="text-default mb-3 text-base font-semibold">{t("danger_zone")}</div>
          {team?.membership.role === "OWNER" ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button color="destructive" className="border" StartIcon={Trash2}>
                  Delete tournament
                </Button>
              </DialogTrigger>
              <ConfirmationDialogContent
                variety="danger"
                title={"Delete Tournament"}
                confirmBtnText={"Are you sure you'd like to delete the tournament?"}
                onConfirm={deleteTeam}>
                {"The tournament has been deleted."}
              </ConfirmationDialogContent>
            </Dialog>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button color="destructive" className="border" StartIcon={LogOut}>
                  Leave tournament
                </Button>
              </DialogTrigger>
              <ConfirmationDialogContent
                variety="danger"
                title={"Leave the tournament"}
                confirmBtnText={"Are you sure you'd like to leave? "}
                onConfirm={leaveTeam}>
                {"You've left the tournament"}
              </ConfirmationDialogContent>
            </Dialog>
          )}
        </>
      ) : (
        <>
          <SkeletonContainer as="form">
            <div className="flex items-center">
              <div className="ms-4">
                <SkeletonContainer>
                  <div className="bg-emphasis h-16 w-16 rounded-full" />
                </SkeletonContainer>
              </div>
            </div>
            <hr className="border-subtle my-8" />
            <SkeletonContainer>
              <div className="mt-8">
                <SkeletonText className="h-6 w-48" />
              </div>
            </SkeletonContainer>
            <SkeletonContainer>
              <div className="mt-8">
                <SkeletonText className="h-6 w-48" />
              </div>
            </SkeletonContainer>
            <div className="mt-8">
              <SkeletonContainer>
                <div className="bg-emphasis h-24 rounded-md" />
              </SkeletonContainer>
              <SkeletonText className="mt-4 h-12 w-32" />
            </div>
            <SkeletonContainer>
              <div className="mt-8">
                <SkeletonText className="h-9 w-24" />
              </div>
            </SkeletonContainer>
          </SkeletonContainer>
        </>
      )}
    </>
  );
};

ProfileView.getLayout = getLayout;

export default ProfileView;
