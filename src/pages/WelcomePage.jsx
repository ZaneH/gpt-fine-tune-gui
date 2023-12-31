import { Button, Container, Flex, Title } from "@mantine/core";
import { route } from "preact-router";
import { Layout } from "../components/Layout";

export const WelcomePage = () => {
    return (
        <Layout hideCloseButton={true}>
            <Container maw="320px" my="xl">
                <Flex direction="column" gap="md">
                    <Title order={3}>Fine-Tune Format</Title>
                    <Button
                        size="md"
                        onClick={() => {
                            route("/editor/openai");
                        }}
                    >
                        OpenAI
                    </Button>
                    <Button
                        size="md"
                        onClick={() => {
                            route("/editor/alpaca");
                        }}
                    >
                        Alpaca
                    </Button>
                </Flex>
            </Container>
        </Layout>
    );
};
