<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_GOOGLE_API_KEY } from '$env/static/public';

	// These now point to the freshly installed Shadcn components
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	let accessToken: string | null = null;

	/** GOOGLE DRIVE LOGIC (PRESERVED) **/
	function initGoogleSignIn() {
		if (typeof google !== 'undefined' && google.accounts?.id) {
			google.accounts.id.initialize({
				client_id: PUBLIC_GOOGLE_CLIENT_ID,
				callback: (res: any) => console.log('Signed in:', res)
			});
			google.accounts.id.renderButton(document.getElementById('googleSignInDiv'), {
				theme: 'outline',
				size: 'large'
			});
		}
	}

	function requestDriveAccess() {
		if (typeof google !== 'undefined' && google.accounts?.oauth2) {
			const client = google.accounts.oauth2.initTokenClient({
				client_id: PUBLIC_GOOGLE_CLIENT_ID,
				scope: 'https://www.googleapis.com/auth/drive.readonly',
				callback: (tokenResponse: any) => {
					accessToken = tokenResponse.access_token;
					loadPicker();
				}
			});
			client.requestAccessToken();
		}
	}

	function loadPicker() {
		if (typeof gapi !== 'undefined' && gapi.load) {
			gapi.load('picker', () => {
				const picker = new google.picker.PickerBuilder()
					.setDeveloperKey(PUBLIC_GOOGLE_API_KEY)
					.setOAuthToken(accessToken!)
					.addView(google.picker.ViewId.DOCS)
					.setCallback(pickerCallback)
					.build();
				picker.setVisible(true);
			});
		}
	}

	async function pickerCallback(data: any) {
		if (data.action === google.picker.Action.PICKED) {
			const file = data.docs[0];
			// API Call logic remains the same
			await fetch('http://localhost:8080/postAsset', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fileId: file.id, fileName: file.name, accessToken })
			});
		}
	}

	onMount(() => {
		initGoogleSignIn();
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white">
	<Card.Root class="w-full max-w-md border-zinc-800 bg-zinc-900">
		<Card.Header>
			<Card.Title>Video Editor Assets</Card.Title>
			<Card.Description>Import media directly from Google Drive</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div id="googleSignInDiv" class="flex justify-center"></div>
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t border-zinc-800" />
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-zinc-900 px-2 text-zinc-500">Or</span>
				</div>
			</div>
			<Button variant="secondary" class="w-full" onclick={requestDriveAccess}>
				Open Drive Picker
			</Button>
		</Card.Content>
	</Card.Root>
</div>
