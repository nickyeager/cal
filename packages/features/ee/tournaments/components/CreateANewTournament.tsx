import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { extractDomainFromWebsiteUrl } from "@calcom/ee/organizations/lib/utils";
import { getSafeRedirectUrl } from "@calcom/lib/getSafeRedirectUrl";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { useParamsWithFallback } from "@calcom/lib/hooks/useParamsWithFallback";
import slugify from "@calcom/lib/slugify";
import { telemetryEventTypes, useTelemetry } from "@calcom/lib/telemetry";
import { trpc } from "@calcom/trpc/react";
import { Avatar, Button, Form, ImageUploader, TextField, Alert, Label } from "@calcom/ui";
import { ArrowRight, Plus } from "@calcom/ui/components/icon";

import { useOrgBranding } from "../../organizations/context/provider";
import type { NewTournamentFormValues } from "../lib/types";

const querySchema = z.object({
  returnTo: z.string().optional(),
  slug: z.string().optional(),
});

export const CreateANewTournament = () => {
  const { t } = useLocale();
  const router = useRouter();
  const telemetry = useTelemetry();
  const params = useParamsWithFallback();
  const parsedQuery = querySchema.safeParse(params);
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
  const orgBranding = useOrgBranding();

  const returnToParam =
    (parsedQuery.success ? getSafeRedirectUrl(parsedQuery.data.returnTo) : "/tournaments") || "/tournaments";

  const newTournamentFormMethods = useForm<NewTournamentFormValues>({
    defaultValues: {
      slug: parsedQuery.success ? parsedQuery.data.slug : "",
    },
  });

  const createTournamentMutation = trpc.viewer.teams.create.useMutation({
    onSuccess: (data) => {
      telemetry.event(telemetryEventTypes.tournament_created);
      router.push(`/tournaments/${data.id}/onboard-participants`);
    },
    onError: (err) => {
      if (err.message === "team_url_taken") {
        newTournamentFormMethods.setError("slug", { type: "custom", message: t("url_taken") });
      } else {
        setServerErrorMessage(err.message);
      }
    },
  });

  return (
    <>
      <Form
        form={newTournamentFormMethods}
        handleSubmit={(v) => {
          if (!createTournamentMutation.isLoading) {
            setServerErrorMessage(null);
            createTournamentMutation.mutate(v);
          }
        }}>
        <div className="mb-8">
          {serverErrorMessage && (
            <div className="mb-4">
              <Alert severity="error" message={t(serverErrorMessage)} />
            </div>
          )}

          <Controller
            name="name"
            control={newTournamentFormMethods.control}
            defaultValue=""
            rules={{
              required: "Tournament Name Required",
            }}
            render={({ field: { value } }) => (
              <>
                <TextField
                  className="mt-2"
                  placeholder="Championships Singles"
                  name="name"
                  label="Tournament Name Required"
                  defaultValue={value}
                  onChange={(e) => {
                    newTournamentFormMethods.setValue("name", e?.target.value);
                    if (newTournamentFormMethods.formState.touchedFields["slug"] === undefined) {
                      newTournamentFormMethods.setValue("slug", slugify(e?.target.value));
                    }
                  }}
                  autoComplete="off"
                />
              </>
            )}
          />
        </div>

        <div className="mb-8">
          <Controller
            name="slug"
            control={newTournamentFormMethods.control}
            rules={{ required: "Tournament Slug Required" }}
            render={({ field: { value } }) => (
              <TextField
                className="mt-2"
                name="slug"
                placeholder="acme"
                label="Tournament slug"
                addOnLeading={`${
                  orgBranding
                    ? `${orgBranding.fullDomain.replace("https://", "").replace("http://", "")}/`
                    : `${extractDomainFromWebsiteUrl}/tournament/`
                }`}
                value={value}
                defaultValue={value}
                onChange={(e) => {
                  newTournamentFormMethods.setValue("slug", slugify(e?.target.value, true), {
                    shouldTouch: true,
                  });
                  newTournamentFormMethods.clearErrors("slug");
                }}
              />
            )}
          />
        </div>

        <div className="mb-8">
          <Controller
            control={newTournamentFormMethods.control}
            name="logo"
            render={({ field: { value } }) => (
              <>
                <Label>Tournament Logo</Label>
                <div className="flex items-center">
                  <Avatar
                    alt=""
                    imageSrc={value}
                    fallback={<Plus className="text-subtle h-6 w-6" />}
                    size="lg"
                  />
                  <div className="ms-4">
                    <ImageUploader
                      target="avatar"
                      id="avatar-upload"
                      buttonMsg={t("update")}
                      handleAvatarChange={(newAvatar: string) => {
                        newTournamentFormMethods.setValue("logo", newAvatar);
                        createTournamentMutation.reset();
                      }}
                      imageSrc={value}
                    />
                  </div>
                </div>
              </>
            )}
          />
        </div>

        <div className="flex space-x-2 rtl:space-x-reverse">
          <Button
            disabled={createTournamentMutation.isLoading}
            color="secondary"
            href={returnToParam}
            className="w-full justify-center">
            {t("cancel")}
          </Button>
          <Button
            disabled={newTournamentFormMethods.formState.isSubmitting || createTournamentMutation.isLoading}
            color="primary"
            EndIcon={ArrowRight}
            type="submit"
            className="w-full justify-center">
            {t("continue")}
          </Button>
        </div>
      </Form>
    </>
  );
};
