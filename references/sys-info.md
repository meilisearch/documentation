# System information

System information offers extended information about hardware usage by MeiliSearch (i.e, _processor_, _memory_).

## Get pretty system information

<RouteHighlighter method="GET" route="/sys-info/pretty"/>

Get pretty system information.

### Example

<code-samples id="get_pretty_sys_info_1" />

#### Response: `200 Ok`

```json
{
  "memoryUsage": "56.3 %",
  "processorUsage": [
    "0.0 %",
    "25.0 %",
    "4.5 %",
    "20.7 %",
    "4.0 %",
    "18.1 %",
    "3.7 %",
    "14.8 %",
    "3.4 %"
  ],
  "global": {
    "totalMemory": "17.18 GB",
    "usedMemory": "9.67 GB",
    "totalSwap": "4.29 GB",
    "usedSwap": "2.58 GB",
    "inputData": "29.82 GB",
    "outputData": "4.22 GB"
  },
  "process": {
    "memory": "5.2 MB",
    "cpu": "0.0 %"
  }
}
```

## Get system information

<RouteHighlighter method="GET" route="/sys-info"/>

Get system information.

### Example

<code-samples id="get_sys_info_1" />

#### Response: `200 Ok`

```json
{
  "memoryUsage": 55.85753917694092,
  "processorUsage": [
    0,
    25.039959,
    4.4766316,
    20.698938,
    3.9757106,
    18.126263,
    3.6868486,
    14.838916,
    3.4483202
  ],
  "global": {
    "totalMemory": 16777216,
    "usedMemory": 9371340,
    "totalSwap": 4194304,
    "usedSwap": 2519552,
    "inputData": 29817185280,
    "outputData": 4216431616
  },
  "process": {
    "memory": 4112,
    "cpu": 0
  }
}
```
