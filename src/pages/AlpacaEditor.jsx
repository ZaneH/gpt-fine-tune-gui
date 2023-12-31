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
    Tooltip,
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
import { Layout } from "../components/Layout";

export const AlpacaEditorPage = () => {
    const [storage, setStorage] = useLocalStorage({
        key: "working_data_alpaca",
        defaultValue: {
            "uuid-4141": {
                messages: [
                    {
                        role: "instruction",
                        content: "Give three tips for staying healthy.",
                    },
                    {
                        role: "input",
                        content: "",
                    },
                    {
                        role: "output",
                        content:
                            "1. Eat a balanced and nutritious diet: Make sure your meals are inclusive of a variety of fruits and vegetables, lean protein, whole grains, and healthy fats. This helps to provide your body with the essential nutrients to function at its best and can help prevent chronic diseases.\n\n2. Engage in regular physical activity: Exercise is crucial for maintaining strong bones, muscles, and cardiovascular health. Aim for at least 150 minutes of moderate aerobic exercise or 75 minutes of vigorous exercise each week.\n\n3. Get enough sleep: Getting enough quality sleep is crucial for physical and mental well-being. It helps to regulate mood, improve cognitive function, and supports healthy growth and immune function. Aim for 7-9 hours of sleep each night.",
                    },
                ],
            },
            "uuid-4142": {
                messages: [
                    {
                        role: "instruction",
                        content: "What are the three primary colors?",
                    },
                    {
                        role: "input",
                        content: "",
                    },
                    {
                        role: "output",
                        content:
                            "The three primary colors are red, blue, and yellow. These colors are called primary because they cannot be created by mixing other colors and all other colors can be made by combining them in various proportions. In the additive color system, used for light, the primary colors are red, green, and blue (RGB).",
                    },
                ],
            },
        },
    });

    const updateContent = useCallback((event, msgIndex, sectionKey) => {
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
    }, []);

    const updateRole = useCallback((role, msgIndex, sectionKey) => {
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
    }, []);

    const removeSection = useCallback((key) => {
        setStorage((prev) => {
            const newStorage = { ...prev };

            delete newStorage[key];

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
                            role: "instruction",
                            content: "",
                        },
                        {
                            role: "input",
                            content: "",
                        },
                        {
                            role: "output",
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
                    type: "message",
                    msgIndex: index,
                });
            });
        }

        _rows.push({
            type: "add-section",
        });

        return _rows;
    }, [storage]);

    const convertImportToStorage = useCallback((data) => {
        const _storage = {};

        const _data = JSON.parse(data);

        _data.forEach((section) => {
            const _section = {
                messages: [],
            };

            for (const key in section) {
                _section.messages.push({
                    role: key,
                    content: section[key],
                });
            }

            _storage[`${uuidv4()}`] = _section;
        });

        return _storage;
    }, []);

    const convertStorageToExport = useCallback(() => {
        const _export = [];

        for (const key in storage) {
            const messages = storage[key].messages;
            const _section = {};

            messages.forEach(({ role, content }) => {
                _section[role] = content;
            });

            _export.push(_section);
        }

        return JSON.stringify(_export, null, 2);
    }, [storage]);

    const rows = generateRows();

    const FullWidthTable = ({ children }) => {
        return <Table style={{ width: "100%" }}>{children}</Table>;
    };

    const getTextAreaRows = (content) => {
        const charCount = content.length;
        if (charCount === 0) {
            return 1;
        }

        const rows = Math.ceil(charCount / 50);
        return Math.min(rows, 8);
    };

    return (
        <Layout header="Alpaca">
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
                        <Button
                            color="gray"
                            size="sm"
                            variant="subtle"
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
                        <Flex gap="md">
                            <Button
                                color="blue"
                                size="sm"
                                variant="subtle"
                                leftSection={<IconDeviceFloppy size={"1rem"} />}
                                onClick={async () => {
                                    save({
                                        title: "Export Fine Tune Data",
                                        defaultPath: "fine-tune-data.json",
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
                                Export .json
                            </Button>
                            <Button
                                color="green"
                                size="sm"
                                variant="subtle"
                                leftSection={<IconCopy size={"1rem"} />}
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        convertStorageToExport()
                                    );
                                }}
                            >
                                Copy .json
                            </Button>
                        </Flex>
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
                                const textareaRows = getTextAreaRows(content);

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
                                                    "instruction",
                                                    "input",
                                                    "output",
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
                                            colSpan={2}
                                            style={{
                                                padding: "12px 4px",
                                            }}
                                        >
                                            <Textarea
                                                key={key}
                                                rows={textareaRows}
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
                                                <Tooltip
                                                    label="Remove section"
                                                    position="left"
                                                >
                                                    <ActionIcon
                                                        radius="xl"
                                                        color="gray"
                                                        variant="light"
                                                        onClick={() => {
                                                            removeSection(key);
                                                        }}
                                                    >
                                                        <IconX size="1rem" />
                                                    </ActionIcon>
                                                </Tooltip>
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
                                                    radius="xl"
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
