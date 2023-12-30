import { Button, Container, Flex } from "@mantine/core";
import { route } from "preact-router";
import { Layout } from "../components/layout";

export const WelcomePage = () => {
    return (
        <Layout hideCloseButton={true}>
            <Container maw="320px" my="xl">
                <Flex direction="column" gap="md">
                    <Button
                        size="lg"
                        onClick={() => {
                            route("/editor");
                        }}
                    >
                        Open Editor
                    </Button>
                </Flex>
            </Container>
        </Layout>
    );
};
