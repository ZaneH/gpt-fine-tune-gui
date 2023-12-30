import { ActionIcon, AppShell, Flex, Title } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { route } from "preact-router";

export const Layout = ({ children, hideCloseButton }) => {
    return (
        <AppShell header={{ height: 60 }} padding="md">
            <AppShell.Header px="xl">
                <Flex align="center" h="100%" justify="space-between">
                    <Title order={3}>GPT Fine-Tune GUI</Title>
                    {!hideCloseButton && (
                        <ActionIcon
                            radius="xl"
                            color="gray"
                            onClick={() => {
                                route("/");
                            }}
                        >
                            <IconX size="1rem" />
                        </ActionIcon>
                    )}
                </Flex>
            </AppShell.Header>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
};
