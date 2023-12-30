import {
    ActionIcon,
    AppShell,
    Box,
    Burger,
    Center,
    Flex,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { route } from "preact-router";

export const Layout = ({ children, hideCloseButton }) => {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            // navbar={{
            //     width: 300,
            //     breakpoint: "sm",
            //     collapsed: { mobile: !opened },
            // }}
            padding="md"
        >
            <AppShell.Header px="xl">
                <Flex align="center" h="100%" justify="space-between">
                    {/* <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    /> */}
                    <Title order={3}>GPT Fine Tune GUI</Title>
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

            {/* <AppShell.Navbar p="md">Navbar</AppShell.Navbar> */}

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
};
