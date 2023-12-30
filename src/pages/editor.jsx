import {
    ActionIcon,
    Button,
    Container,
    Flex,
    Select,
    Space,
    Table,
    Text,
    Textarea,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
    IconCopy,
    IconDeviceFloppy,
    IconFileImport,
    IconPlus,
    IconX,
} from "@tabler/icons-react";
import { fs } from "@tauri-apps/api";
import { open, save } from "@tauri-apps/api/dialog";
import { useCallback } from "preact/compat";
import { TableVirtuoso } from "react-virtuoso";
import { v4 as uuidv4 } from "uuid";
import { Layout } from "../components/layout";

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

    const updateContent = useCallback(
        (event, msgIndex, sectionKey) => {
            setStorage((prev) => {
                const messages = prev[sectionKey].messages;
                const prevMessage = messages[msgIndex];

                const newStorage = {
                    ...prev,
                    [sectionKey]: {
                        messages: [
                            ...messages.slice(0, msgIndex),
                            {
                                ...prevMessage,
                                content: event.target.value,
                            },
                            ...messages.slice(msgIndex + 1),
                        ],
                    },
                };

                return newStorage;
            });
        },
        [storage]
    );

    const updateRole = useCallback(
        (role, msgIndex, sectionKey) => {
            setStorage((prev) => {
                const messages = prev[sectionKey].messages;
                const prevMessage = messages[msgIndex];

                const newStorage = {
                    ...prev,
                    [sectionKey]: {
                        messages: [
                            ...messages.slice(0, msgIndex),
                            {
                                ...prevMessage,
                                role,
                            },
                            ...messages.slice(msgIndex + 1),
                        ],
                    },
                };

                return newStorage;
            });
        },
        [storage]
    );

    const removeExample = useCallback(
        (key) => {
            setStorage((prev) => {
                const newStorage = { ...prev };

                delete newStorage[key];

                return newStorage;
            });
        },
        [storage]
    );

    const removeMessage = useCallback(
        (key, msgIndex) => {
            setStorage((prev) => {
                const messages = prev[key].messages;

                const newStorage = {
                    ...prev,
                    [key]: {
                        messages: [
                            ...messages.slice(0, msgIndex),
                            ...messages.slice(msgIndex + 1),
                        ],
                    },
                };

                return newStorage;
            });
        },
        [storage]
    );

    const addNewMessage = useCallback((sectionKey) => {
        setStorage((prev) => {
            const messages = prev[sectionKey].messages;

            const newStorage = {
                ...prev,
                [sectionKey]: {
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
    }, []);

    const addNewSection = useCallback(() => {
        setStorage((prev) => {
            const newStorage = {
                ...prev,
                [`${uuidv4()}`]: {
                    messages: [
                        {
                            role: "system",
                            content: "",
                        },
                    ],
                },
            };

            return newStorage;
        });
    }, []);

    const generateRows = useCallback(() => {
        // convert storage to rows
        const _rows = [];
        for (const key in storage) {
            const messages = storage[key].messages;

            _rows.push({
                type: "section",
                key,
            });

            messages.forEach(({ role, content }, index) => {
                _rows.push({
                    key,
                    role,
                    content,
                    index,
                    type: "message",
                    msgIndex: index,
                });
            });

            _rows.push({
                type: "add-message",
                key,
            });
        }

        _rows.push({
            type: "add-section",
        });

        return _rows;
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

    const rows = generateRows();

    const FullWidthTable = ({ children }) => {
        return <Table style={{ width: "100%" }}>{children}</Table>;
    };

    return (
        <Layout>
            <Container h="calc(100dvh - 100px)">
                <Flex
                    style={{
                        flex: "1 1 auto",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    {/* Menu buttons */}
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
                                        fs.readTextFile(selected).then(
                                            (data) => {
                                                setStorage(() => {
                                                    const newStorage =
                                                        convertImportToStorage(
                                                            data
                                                        );

                                                    return newStorage;
                                                });
                                            }
                                        );
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
                    {/* Data table */}
                    <TableVirtuoso
                        data={rows}
                        components={{
                            Table: FullWidthTable,
                            TableRow: Table.Tr,
                            TableBody: Table.Tbody,
                            TableHead: Table.Thead,
                        }}
                        totalCount={rows.length}
                        fixedHeaderContent={() => (
                            <Table.Tr>
                                <Table.Th
                                    bg="dark"
                                    style={{
                                        width: 150,
                                    }}
                                >
                                    Role
                                </Table.Th>
                                <Table.Th bg="dark">Content</Table.Th>
                                <Table.Th bg="dark"></Table.Th>
                            </Table.Tr>
                        )}
                        itemContent={(index, row) => {
                            const { role, content, type, key, msgIndex } =
                                row || {};

                            if (type === "message") {
                                return (
                                    <>
                                        <td
                                            style={{
                                                width: 150,
                                                verticalAlign: "top",
                                                padding: "12px 4px",
                                            }}
                                        >
                                            <Select
                                                allowDeselect={false}
                                                placeholder="Role..."
                                                data={[
                                                    "user",
                                                    "system",
                                                    "assistant",
                                                ]}
                                                defaultValue={role}
                                                value={role}
                                                onChange={(value) => {
                                                    updateRole(
                                                        value,
                                                        msgIndex,
                                                        key
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td
                                            style={{
                                                padding: "12px 4px",
                                            }}
                                        >
                                            <Textarea
                                                key={key}
                                                autosize
                                                defaultValue={content}
                                                onBlur={(event) => {
                                                    updateContent(
                                                        event,
                                                        msgIndex,
                                                        key
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td
                                            style={{
                                                verticalAlign: "top",
                                                padding: "12px 4px",
                                            }}
                                        >
                                            <Flex justify="end">
                                                <ActionIcon
                                                    radius="xl"
                                                    color="white"
                                                    gradient={{
                                                        from: "red",
                                                        to: "orange",
                                                    }}
                                                    variant="gradient"
                                                    onClick={() => {
                                                        removeMessage(
                                                            key,
                                                            msgIndex
                                                        );
                                                    }}
                                                >
                                                    <IconX size="1rem" />
                                                </ActionIcon>
                                            </Flex>
                                        </td>
                                    </>
                                );
                            } else if (type === "section") {
                                return (
                                    <>
                                        <td colSpan={2}>
                                            <Text size="sm" c="dark">
                                                {key}
                                            </Text>
                                        </td>
                                        <td
                                            colSpan={1}
                                            style={{
                                                padding: "12px 4px",
                                            }}
                                        >
                                            <Flex justify="end">
                                                <ActionIcon
                                                    radius="xl"
                                                    color="white"
                                                    gradient={{
                                                        from: "red",
                                                        to: "orange",
                                                    }}
                                                    variant="gradient"
                                                    onClick={() => {
                                                        removeExample(key);
                                                    }}
                                                >
                                                    <IconX size="1rem" />
                                                </ActionIcon>
                                            </Flex>
                                        </td>
                                    </>
                                );
                            } else if (type === "add-message") {
                                return (
                                    <>
                                        <td
                                            colSpan={3}
                                            style={{
                                                padding: "12px 4px",
                                            }}
                                        >
                                            <Flex justify="center">
                                                <Button
                                                    color="blue"
                                                    variant="outline"
                                                    leftSection={
                                                        <IconPlus
                                                            size={"1rem"}
                                                        />
                                                    }
                                                    onClick={() => {
                                                        addNewMessage(key);
                                                    }}
                                                >
                                                    Add Message
                                                </Button>
                                            </Flex>
                                        </td>
                                    </>
                                );
                            } else if (type === "add-section") {
                                return (
                                    <>
                                        <td
                                            colSpan={3}
                                            style={{
                                                padding: "12px 4px",
                                            }}
                                        >
                                            <Flex justify="center">
                                                <Button
                                                    color="blue"
                                                    variant="outline"
                                                    leftSection={
                                                        <IconPlus
                                                            size={"1rem"}
                                                        />
                                                    }
                                                    onClick={() => {
                                                        addNewSection();
                                                    }}
                                                >
                                                    Add Section
                                                </Button>
                                            </Flex>
                                        </td>
                                    </>
                                );
                            }
                        }}
                    />
                </Flex>
            </Container>
        </Layout>
    );
};
