import re

with open('server.ts', 'r') as f:
    content = f.read()

# Health check
content = re.sub(r'\} catch \(e\) \{\n\s*dbStatus = \'error\';\n\s*\}', r"""} catch (e) {
      logError('Health check DB connection failed', e);
      dbStatus = 'error';
    }""", content)

# Auth sync
content = re.sub(r'\} catch \(err: any\) \{\n\s*console.error\(\'Error syncing user:\', err\);\n\s*res.status\(500\)\.json\(\{ error: err\.message \|\| \'Error occurred during database auth sync\' \}\);\n\s*\}', r"""} catch (err: any) {
      logError('Auth sync failed', err);
      res.status(500).json({ error: err.message || 'Error occurred during database auth sync' });
    }""", content)

# Wallet balance
content = re.sub(r'\} catch \(err: any\) \{\n\s*console.error\(\'Error updating wallet:\', err\);\n\s*res.status\(500\)\.json\(\{ error: err\.message \|\| \'Error updating wallet balance\' \}\);\n\s*\}', r"""} catch (err: any) {
      logError('Wallet update failed', err);
      res.status(500).json({ error: err.message || 'Error updating wallet balance' });
    }""", content)

# Identity verification
content = re.sub(r'\} catch \(err: any\) \{\n\s*console.error\(\'Error creating verification session:\', err\);\n\s*res.status\(500\)\.json\(\{ error: err\.message \}\);\n\s*\}', r"""} catch (err: any) {
      logError('Create verification session failed', err);
      res.status(500).json({ error: err.message });
    }""", content)

# Stripe checkout
content = re.sub(r'\} catch \(err: any\) \{\n\s*console.error\(\'Error creating checkout session:\', err\);\n\s*res.status\(500\)\.json\(\{ error: err\.message \|\| \'Error starting checkout\' \}\);\n\s*\}', r"""} catch (err: any) {
      logError('Create checkout session failed', err);
      res.status(500).json({ error: err.message || 'Error starting checkout' });
    }""", content)

# Stripe webhook
content = re.sub(r'\} catch \(err: any\) \{\n\s*console.error\(`❌ Stripe webhooks verification failed: \$\{err.message\}`\);\n\s*res.status\(400\).send\(`Webhook Error: \$\{err.message\}`\);\n\s*\}', r"""} catch (err: any) {
      logError('Stripe webhook failed', err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }""", content)

# Workspace log action (may not exist anymore, but just in case)
content = re.sub(r'\} catch \(err: any\) \{\n\s*console.error\(\'Error logging workspace action:\', err\);\n\s*res.status\(500\)\.json\(\{ error: err\.message \}\);\n\s*\}', r"""} catch (err: any) {
      logError('Workspace log action failed', err);
      res.status(500).json({ error: err.message });
    }""", content)

# Workspace log GET
content = re.sub(r'\} catch \(err: any\) \{\n\s*console.error\(\'Error retrieving workspace logs:\', err\);\n\s*res.status\(500\)\.json\(\{ error: err\.message \}\);\n\s*\}', r"""} catch (err: any) {
      logError('Workspace get logs failed', err);
      res.status(500).json({ error: err.message });
    }""", content)

# Providers GET
content = re.sub(r'\} catch \(err: any\) \{\n\s*res.status\(500\)\.json\(\{ error: err\.message \}\);\n\s*\}', r"""} catch (err: any) {
      logError('API fetch failed', err);
      res.status(500).json({ error: err.message });
    }""", content)

with open('server.ts', 'w') as f:
    f.write(content)

