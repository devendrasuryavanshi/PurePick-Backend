import express from 'express';
import { authenticator } from 'otplib';
import NodeCache from 'node-cache';
import bcrypt from 'bcryptjs';

const router = express.Router();

const verificationCache = new NodeCache({ stdTTL: 60 * 60 * 24, checkperiod: 10 }); // 24h
const resetCache = new NodeCache({ stdTTL: 60 * 60 * 24, checkperiod: 10 }); // 24h

const MAX_ATTEMPTS = 5;
const BASE_BACKOFF = 2;
const EXPIRE_TIME = 5 * 60 * 1000;

const getTargetCache = (type) => {
    return type === 'Verification' ? verificationCache : resetCache;
};

router.post('/send-otp', async (req, res) => {
    try {
        const { email, hashedOTP, type } = req.body;
        
        const targetCache = getTargetCache(type);
        const data = targetCache.get(email);

        targetCache.set(email, {
            attempts: data ? data.attempts + 1 : 1,
            otp: hashedOTP,
            lastAttemptTime: Date.now()
        });

        return res.json({ isSent: true });
    } catch (error) {
        return res.status(500).json({ error: "Failed to send OTP", isSent: false });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp, type } = req.body;
        const targetCache = getTargetCache(type);
        const data = targetCache.get(email);

        if (!data) {
            return res.status(400).json({ error: 'No OTP found' });
        }

        if (data.lastAttemptTime + EXPIRE_TIME < Date.now()) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        const isMatch = await bcrypt.compare(otp, data.otp);
        if (isMatch) {
            return res.json({ message: 'OTP verified successfully' });
        }

        return res.status(400).json({ error: 'Invalid OTP' });
    } catch (error) {
        return res.status(500).json({ error: "Failed to verify OTP" });
    }
});

router.post('/can-attempt', async (req, res) => {
    try {
        const { email, type } = req.body;
        const targetCache = getTargetCache(type);
        const data = targetCache.get(email);

        if (!data?.attempts || data.attempts < MAX_ATTEMPTS) {
            return res.json({ allowed: true });
        }

        const backoffTime = Math.pow(BASE_BACKOFF, data.attempts) * 1000;
        const waitTime = (data.lastAttemptTime + backoffTime - Date.now()) / 1000;

        return res.json({ 
            allowed: waitTime <= 0,
            waitTime: waitTime > 0 ? Math.ceil(waitTime) : 0
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to check attempt status" });
    }
});

export default router;
