---
title: What is Jev? An AI model built to make decisions
date: 2026-09-22
excerpt: Jev is a new AI model from TypeSafe that skips the paragraphs and gives your software a clear, confident decision it can act on.
coverImage: /images/posts/what-is-jev-an-ai-model-built-to-make-decisions.webp
tags: ["ai", "jev", "ai-models", "developer-tools"]
---

## AI that decides instead of writes

Most AI tools you've heard of are built to write. ChatGPT, Claude and Gemini can draft emails, summarize reports and hold a conversation.

But a lot of software doesn't need AI to write anything. It needs AI to make a call.

Is this message about billing or a tech problem? Is this request urgent? Should this action be allowed?

That's the gap **Jev** is trying to fill. TypeSafe AI released it in September 2026, and it's built to do one thing well: return a clear, structured decision that your code can use right away.

TypeSafe calls this new kind of model a **System One Model**. ([Read the announcement](https://typesafe.ai/blog/introducing-system-one-models-and-jev))

## Think of it as a smart "if" statement

Here's how normal code makes a decision:

```text
if customer_type == "premium":
    route_to_priority_support()
else:
    route_to_standard_support()
```

That works when your data is neat. Real life isn't neat.

A customer might write: *"I've been charged twice and I need someone to fix this ASAP."*

A basic `if` statement can't make sense of that. An LLM can, but it'll usually reply with text. Then you have to parse that text before your app can act on it.

Jev works differently. You give it a question and a fixed set of answers:

```text
Which department should handle this?

A. Billing
B. Technical Support
C. Sales
D. Account Management
```

It sends back a decision with a probability for each option:

```text
Billing:             0.91
Technical Support:   0.05
Sales:               0.02
Account Management:  0.02
```

Your app takes it from there. No parsing. No guessing.

![Diagram comparing a chatbot writing a long reply with Jev returning a single labeled decision](/images/posts/what-is-jev-an-ai-model-built-to-make-decisions-1.webp)

## How it's different from ChatGPT

Jev isn't here to write blog posts, code or emails. It's not a chatbot.

The simplest way to see the difference:

- **A regular LLM:** input goes in, text comes out
- **Jev:** messy input goes in, a typed decision comes out

TypeSafe says Jev is built for machines to use, not for people to chat with. ([TypeSafe overview](https://typesafe.ai/))

### "Can't I just ask an LLM for JSON?"

Fair question. Developers have done that for a while.

The difference is in how the answer is made. An LLM still writes its answer word by word. You then squeeze that into the format you want.

Jev is designed around the decision itself. The possible answers are fixed up front, and every result comes with probabilities and a confidence score. That matters a lot when the output feeds straight into your app's logic.

## The three kinds of decisions Jev makes

The Jev API gives you three basic building blocks. ([API docs](https://api.typesafe.ai/docs))

**1. Choice.** Pick one option from a list. *"Which team should handle this ticket: Billing, Technical, Sales or Account?"*

**2. Yes/no.** Get a probability for a yes-or-no question. *"Does this customer want a refund?"*

**3. Score.** Rate something on a scale. *"How urgent is this request, from 1 (Low) to 4 (Critical)?"*

You can chain these together with regular code to build bigger workflows.

## Where Jev could be useful

Plenty of software is full of small decisions. Right now they're handled by rigid rules that break easily, or by LLM calls that cost more than they need to. Jev aims for the middle.

Some examples:

- **Sorting messages.** Tag 100,000 support emails as Billing, Refund, Technical or Sales.
- **Routing tickets.** Send each ticket to the right team.
- **Checking data.** Does the vendor name on this invoice match the purchase order?
- **Guarding AI agents.** Before an agent runs something risky like `DELETE_CUSTOMER`, ask Jev: is this allowed?
- **Picking the right model.** Send easy requests to a small, cheap model. Save the big model for hard ones.
- **Grading AI answers.** Does this LLM reply meet the requirements? If yes, send it. If not, retry.

## The best part: it tells you how sure it is

Jev doesn't just say "Billing." It tells you how confident it is.

That lets you build simple rules like this:

```text
Confidence above 90%   →  act automatically
Confidence 60–90%      →  run extra checks
Confidence below 60%   →  send to a human
```

This is how real production software should work. Instead of pretending AI is always right, you make the trust level part of your business logic. TypeSafe recommends exactly this approach.

## Why it's fast and cheap

An LLM writing a paragraph produces one word after another. Jev makes its decisions in parallel.

According to TypeSafe, that comes down to three things: a new model design, a parallel sampler, and a training method called **Reinforcement Learning for Calibrated Decisions (RLCD)**.

TypeSafe reports response times of about **70–500 ms** and lists pricing at **$0.042 per million input tokens**, with output tokens free. ([Pricing and performance](https://typesafe.ai/))

One thing to keep in mind: these are the company's own numbers, not independent tests.

## A note of caution

Jev is brand new. Many of the big claims floating around, like "193.6× faster" or "444.6× cheaper," come from TypeSafe's own tests.

To its credit, TypeSafe is upfront about this. It says its workflow tests were built by its own team, and the "correct" answers were based on other frontier models. ([See the evals](https://evals.typesafe.ai/))

So don't treat those numbers as true for every use case. The real question is simpler: **does Jev get the decisions right for your app?** Test it on your own data before you trust it.

## LLMs aren't going anywhere

Jev doesn't replace LLMs. It works alongside them.

Picture a support app:

1. **The LLM** reads and understands the customer's message.
2. **Jev** makes the specific calls: refund or not, escalate or not.
3. **Your code** carries out the business rules.

Each piece does what it's best at.

## The big idea

For years, we've thought about AI like this: *prompt in, response out.*

Jev offers another way: *situation in, decision out, software acts.*

If AI gets cheap and fast enough to handle thousands of tiny decisions, you can put smarts in places that used to be too slow or too expensive. Checking an address at checkout. Sorting sales leads. Letting an agent double-check its own actions.

Or in one line:

> **LLMs write. Jev decides. Code acts.**

Jev is in early access right now, so we'll soon see where it shines and where it doesn't. If you build software that makes lots of small calls, it's worth a look. ([Try Jev](https://typesafe.ai/))

## Further reading

- [Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [TypeSafe AI](https://typesafe.ai/)
- [Jev API documentation](https://api.typesafe.ai/docs)
- [TypeSafe workflow evaluations](https://evals.typesafe.ai/)