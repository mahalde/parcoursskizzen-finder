<script>
	import Footer from "./Footer.svelte";
	import Form from "./Form.svelte";
	import Header from "./Header.svelte";
	import List from "./List.svelte";

	let parcours;

	function handleSearchParcours(event) {
		parcours = event.detail;
	}
</script>

<main>
	<Header></Header>
	<Form on:searchParcours={handleSearchParcours}></Form>
	<List {parcours}></List>
</main>
<Footer></Footer>