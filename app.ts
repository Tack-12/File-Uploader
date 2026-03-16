import expressSession from 'express-session';
import express from "express";
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client/extension';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';




