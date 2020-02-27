import frontpage from './themes/frontpage';

interface Presentation {
  name: string;
  theme: { [key: string]: string | undefined };
  application_vars: { [key: string]: any };
  created_at: string;
  updated_at: string;
  application_id: string;
  application_deployment_id: string;
  application_name: string;
}

export default (presentation: Presentation) => {
  const theme = presentation.theme || {};
  return {
    name: presentation.name,
    values: presentation.application_vars,
    createdAt: presentation.created_at,
    updatedAt: presentation.updated_at,
    applicationId: presentation.application_id,
    applicationDeploymentId: presentation.application_deployment_id,
    applicationName: presentation.application_name,
    theme: {
      name: theme.name || frontpage.name,
      backgroundColor: theme.background_color || frontpage.background_color,
      bodyFont: theme.body_font || frontpage.body_font,
      bodyTextColor: theme.body_text_color || frontpage.body_text_color,
      headingFont: theme.heading_font || frontpage.heading_font,
      headingTextColor:
        theme.heading_text_color || frontpage.heading_text_color,
      // These are optional fields and should not default to front page to allow
      // apps to handle the default values if not set.
      backgroundImage: theme.background_image,
      backgroundImagePortrait: theme.background_image_portrait,
      heading2Font: theme.heading_2_font,
      heading2TextColor: theme.heading_2_text_color,
      borderColor: theme.border_color,
    },
  };
};
