---
title: Chat tooling reference
description: An exhaustive reference of special chat tools supported by Meilisearch
---

When creating your conversational search agent, you may be able to extend the model's capabilities with a number of tools. This page lists Meilisearch-specific tools that may improve user experience.

<Note>
This is an experimental feature. Use the Meilisearch Cloud UI or the experimental features endpoint to activate it:

```sh
curl \
  -X PATCH 'MEILISEARCH_URL/experimental-features/' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "chatCompletions": true
  }'
```
</Note>

## Meilisearch chat tools

For the best user experience, configure all following tools.

1. **Handle progress updates** by displaying search status to users during streaming
2. **Append conversation messages** as requested to maintain context for future requests
3. **Display source documents** to users for transparency and verification
4. **Use `call_id`** to associate progress updates with their corresponding source results

<Note>
These special tools are handled internally by Meilisearch and are not forwarded to the LLM provider. They serve as a communication mechanism between Meilisearch and your application to provide enhanced user experience features.
</Note>

### `_meiliSearchProgress`

This tool reports real-time progress of internal search operations. When declared, Meilisearch will call this function whenever search operations are performed in the background.

**Purpose**: Provides transparency about search operations and reduces perceived latency by showing users what's happening behind the scenes.

**Arguments**:

- `call_id`: Unique identifier to track the search operation
- `function_name`: Name of the internal function being executed (e.g., "_meiliSearchInIndex")
- `function_parameters`: JSON-encoded string containing search parameters like `q` (query) and `index_uid`

**Example Response**:

```json
{
  "function": {
    "name": "_meiliSearchProgress",
    "arguments": "{\"call_id\":\"89939d1f-6857-477c-8ae2-838c7a504e6a\",\"function_name\":\"_meiliSearchInIndex\",\"function_parameters\":\"{\\\"index_uid\\\":\\\"movies\\\",\\\"q\\\":\\\"search engine\\\"}\"}"
  }
}
```

### `_meiliAppendConversationMessage`

Since the `/chats/{workspace}/chat/completions` endpoint is stateless, this tool helps maintain conversation context by requesting the client to append internal messages to the conversation history.

**Purpose**: Maintains conversation context for better response quality in subsequent requests by preserving tool calls and results.

**Arguments**:

- `role`: Message author role ("user" or "assistant")
- `content`: Message content (for tool results)
- `tool_calls`: Array of tool calls made by the assistant
- `tool_call_id`: ID of the tool call this message responds to

**Example Response**:

```json
{
  "function": {
    "name": "_meiliAppendConversationMessage",
    "arguments": "{\"role\":\"assistant\",\"tool_calls\":[{\"id\":\"call_ijAdM42bixq9lAF4SiPwkq2b\",\"type\":\"function\",\"function\":{\"name\":\"_meiliSearchInIndex\",\"arguments\":\"{\\\"index_uid\\\":\\\"movies\\\",\\\"q\\\":\\\"search engine\\\"}\"}}]}"
  }
}
```

### `_meiliSearchSources`

This tool provides the source documents that were used by the LLM to generate responses, enabling transparency and allowing users to verify information sources.

**Purpose**: Shows users which documents were used to generate responses, improving trust and enabling source verification.

**Arguments**:

- `call_id`: Matches the `call_id` from `_meiliSearchProgress` to associate queries with results
- `documents`: JSON object containing the source documents with only displayed attributes

**Example Response**:

```json
{
  "function": {
    "name": "_meiliSearchSources",
    "arguments": "{\"call_id\":\"abc123\",\"documents\":[{\"id\":197302,\"title\":\"The Sacred Science\",\"overview\":\"Diabetes. Prostate cancer...\",\"genres\":[\"Documentary\",\"Adventure\",\"Drama\"]}]}"
  }
}
```

### Sample OpenAI tool declaration

Include these tools in your request's `tools` array to enable enhanced functionality:

<CodeGroup>

```json
{
  …
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "_meiliSearchProgress",
        "description": "Provides information about the current Meilisearch search operation",
        "parameters": {
          "type": "object",
          "properties": {
            "call_id": {
              "type": "string",
              "description": "The call ID to track the sources of the search"
            },
            "function_name": {
              "type": "string",
              "description": "The name of the function we are executing"
            },
            "function_parameters": {
              "type": "string",
              "description": "The parameters of the function we are executing, encoded in JSON"
            }
          },
          "required": ["call_id", "function_name", "function_parameters"],
          "additionalProperties": false
        },
        "strict": true
      }
    },
    {
      "type": "function",
      "function": {
        "name": "_meiliAppendConversationMessage",
        "description": "Append a new message to the conversation based on what happened internally",
        "parameters": {
          "type": "object",
          "properties": {
            "role": {
              "type": "string",
              "description": "The role of the messages author, either `role` or `assistant`"
            },
            "content": {
              "type": "string",
              "description": "The contents of the `assistant` or `tool` message. Required unless `tool_calls` is specified."
            },
            "tool_calls": {
              "type": ["array", "null"],
              "description": "The tool calls generated by the model, such as function calls",
              "items": {
                "type": "object",
                "properties": {
                  "function": {
                    "type": "object",
                    "description": "The function that the model called",
                    "properties": {
                      "name": {
                        "type": "string",
                        "description": "The name of the function to call"
                      },
                      "arguments": {
                        "type": "string",
                        "description": "The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function."
                      }
                    }
                  },
                  "id": {
                    "type": "string",
                    "description": "The ID of the tool call"
                  },
                  "type": {
                    "type": "string",
                    "description": "The type of the tool. Currently, only function is supported"
                  }
                }
              }
            },
            "tool_call_id": {
              "type": ["string", "null"],
              "description": "Tool call that this message is responding to"
            }
          },
          "required": ["role", "content", "tool_calls", "tool_call_id"],
          "additionalProperties": false
        },
        "strict": true
      }
    },
    {
      "type": "function",
      "function": {
        "name": "_meiliSearchSources",
        "description": "Provides sources of the search",
        "parameters": {
          "type": "object",
          "properties": {
            "call_id": {
              "type": "string",
              "description": "The call ID to track the original search associated to those sources"
            },
            "documents": {
              "type": "object",
              "description": "The documents associated with the search (call_id). Only the displayed attributes of the documents are returned"
            }
          },
          "required": ["call_id", "documents"],
          "additionalProperties": false
        },
        "strict": true
      }
    }
  ]
}
```

</CodeGroup>
