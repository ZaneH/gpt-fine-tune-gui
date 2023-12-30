import {
    ActionIcon,
    Button,
    Container,
    Flex,
    Select,
    Space,
    Table,
    Textarea,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
    IconCopy,
    IconDeviceFloppy,
    IconFileExport,
    IconFileImport,
    IconMessage2Plus,
    IconPlus,
    IconX,
} from "@tabler/icons-react";
import { useCallback } from "preact/compat";
import { v4 as uuidv4 } from "uuid";
import { Layout } from "../components/layout";
import { open, save } from "@tauri-apps/api/dialog";
import { fs } from "@tauri-apps/api";

export const EditorPage = () => {
    const [storage, setStorage] = useLocalStorage({
        key: "working_data",
        defaultValue: {
            "uuid-4121": {
                messages: [
                    {
                        role: "system",
                        content: "You are Grok",
                    },
                    {
                        role: "user",
                        content: "Hello",
                    },
                    {
                        role: "assistant",
                        content:
                            "Hello there! I'm Grok, your personal assistant.",
                    },
                ],
            },
            "uuid-4122": {
                messages: [
                    {
                        role: "system",
                        content: "You are Grok",
                    },
                    {
                        role: "user",
                        content: "Hello",
                    },
                    {
                        role: "assistant",
                        content:
                            "Hello there! I'm Grok, your personal assistant.",
                    },
                ],
            },
        },
    });

    const rows = useCallback(() => {
        return Object.keys(storage).map((key) => {
            const messages = storage[key].messages;

            return messages
                .map(({ role, content }, index) => {
                    return (
                        <Table.Tr>
                            <Table.Td style={{ verticalAlign: "top" }}>
                                <Select
                                    allowDeselect={false}
                                    placeholder="Role..."
                                    data={["user", "system", "assistant"]}
                                    defaultValue={role}
                                    value={role}
                                    onChange={(value) => {
                                        setStorage((prev) => {
                                            const newStorage = {
                                                ...prev,
                                                [key]: {
                                                    messages: [
                                                        ...messages.slice(
                                                            0,
                                                            index
                                                        ),
                                                        {
                                                            role: value,
                                                            content,
                                                        },
                                                        ...messages.slice(
                                                            index + 1
                                                        ),
                                                    ],
                                                },
                                            };

                                            return newStorage;
                                        });
                                    }}
                                />
                            </Table.Td>
                            <Table.Td>
                                <Textarea
                                    autosize
                                    defaultValue={content}
                                    onChange={(event) => {
                                        setStorage((prev) => {
                                            const newStorage = {
                                                ...prev,
                                                [key]: {
                                                    messages: [
                                                        ...messages.slice(
                                                            0,
                                                            index
                                                        ),
                                                        {
                                                            role,
                                                            content:
                                                                event
                                                                    .currentTarget
                                                                    .value,
                                                        },
                                                        ...messages.slice(
                                                            index + 1
                                                        ),
                                                    ],
                                                },
                                            };

                                            return newStorage;
                                        });
                                    }}
                                />
                            </Table.Td>
                            <Table.Td>
                                <Flex justify="end">
                                    <ActionIcon
                                        color="red"
                                        variant="subtle"
                                        onClick={() => {
                                            setStorage((prev) => {
                                                const newStorage = {
                                                    ...prev,
                                                    [key]: {
                                                        messages: [
                                                            ...messages.slice(
                                                                0,
                                                                index
                                                            ),
                                                            ...messages.slice(
                                                                index + 1
                                                            ),
                                                        ],
                                                    },
                                                };

                                                return newStorage;
                                            });
                                        }}
                                    >
                                        <IconX />
                                    </ActionIcon>
                                </Flex>
                            </Table.Td>
                        </Table.Tr>
                    );
                })
                .concat(
                    messages.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={3}>
                                <Button
                                    variant="subtle"
                                    color="red"
                                    fullWidth
                                    onClick={() => {
                                        setStorage((prev) => {
                                            const newStorage = {
                                                ...prev,
                                            };

                                            delete newStorage[key];

                                            return newStorage;
                                        });
                                    }}
                                >
                                    Delete this example
                                </Button>
                            </Table.Td>
                        </Table.Tr>
                    ) : null,
                    <Table.Tr>
                        <Table.Td colSpan={3}>
                            <Button
                                variant="subtle"
                                color="gray"
                                fullWidth
                                leftSection={<IconMessage2Plus size={"1rem"} />}
                                onClick={() => {
                                    setStorage((prev) => {
                                        const newStorage = {
                                            ...prev,
                                            [key]: {
                                                messages: [
                                                    ...messages,
                                                    {
                                                        role: "user",
                                                        content: "",
                                                    },
                                                ],
                                            },
                                        };

                                        return newStorage;
                                    });
                                }}
                            >
                                Add new message...
                            </Button>
                        </Table.Td>
                    </Table.Tr>
                );
        });
    }, [storage]);

    const convertImportToStorage = useCallback((data) => {
        const lines = data.split("\n");

        const newStorage = {};

        lines.forEach((line) => {
            try {
                const uuid = uuidv4();
                const parsed = JSON.parse(line);
                const { messages } = parsed;

                newStorage[uuid] = {
                    messages,
                };
            } catch (e) {
                // TODO: Handle error
                console.log(e);
            }
        });

        return newStorage;
    }, []);

    const convertStorageToExport = useCallback(() => {
        const lines = Object.keys(storage).map((key) => {
            const { messages } = storage[key];

            return JSON.stringify({ messages });
        });

        return lines.join("\n");
    }, [storage]);

    return (
        <Layout>
            <Container>
                <Flex w="100%" justify="space-between">
                    <Flex gap="md">
                        <Button
                            color="gray"
                            leftSection={<IconFileImport size={"1rem"} />}
                            onClick={async () => {
                                const selected = await open({
                                    title: "Import Fine Tune Data",
                                });

                                if (selected?.length > 0) {
                                    fs.readTextFile(selected).then((data) => {
                                        setStorage(() => {
                                            const newStorage =
                                                convertImportToStorage(data);

                                            return newStorage;
                                        });
                                    });
                                }
                            }}
                        >
                            Import
                        </Button>
                        <Button
                            color="gray"
                            leftSection={<IconDeviceFloppy size={"1rem"} />}
                            onClick={async () => {
                                save({
                                    title: "Export Fine Tune Data",
                                    defaultPath: "fine-tune-data.jsonl",
                                }).then((selected) => {
                                    if (selected?.length > 0) {
                                        fs.writeFile(
                                            selected,
                                            convertStorageToExport()
                                        ).then(() => {
                                            console.log("File saved");
                                        });
                                    }
                                });
                            }}
                        >
                            Export .jsonl
                        </Button>
                    </Flex>
                    <Button
                        color="green"
                        leftSection={<IconCopy size={"1rem"} />}
                        onClick={() => {
                            navigator.clipboard.writeText(
                                convertStorageToExport()
                            );
                        }}
                    >
                        Copy .jsonl
                    </Button>
                </Flex>
                <Space h="lg" />
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Role</Table.Th>
                            <Table.Th>Message</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <colgroup>
                        <col span="1" style="width: 20%;" />
                        <col span="1" style="width: 75%;" />
                        <col span="1" style="width: 5%;" />
                    </colgroup>
                    <Table.Tbody>
                        {rows()}
                        <Table.Tr>
                            <Table.Td colSpan={3}>
                                <Button
                                    variant="subtle"
                                    color="gray"
                                    fullWidth
                                    leftSection={<IconPlus size={"1rem"} />}
                                    onClick={() => {
                                        setStorage((prev) => {
                                            const newStorage = {
                                                ...prev,
                                                [`${uuidv4()}`]: {
                                                    messages: [
                                                        {
                                                            role: "user",
                                                            content: "",
                                                        },
                                                    ],
                                                },
                                            };

                                            return newStorage;
                                        });
                                    }}
                                >
                                    Add new example...
                                </Button>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Container>
        </Layout>
    );
};
